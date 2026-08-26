"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { categories } from "../../lib/catalog";

const EMPTY = {
  name: "",
  brand: "",
  range: "",
  categorySlug: "",
  subcategory: "",
  description: "",
  longDescription: "",
  features: "",
  packSizes: "",
  finish: "",
  coverage: "",
  warranty: "",
  manufacturerUrl: "",
  image: "",
  available: true,
  featured: false,
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCategory(slug) {
  return categories.find((item) => item.slug === slug);
}

function validateProduct(form, isEditing, hasNewImages = false) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Product name is required.";
  if (!form.brand.trim()) errors.brand = "Brand is required.";
  if (!form.categorySlug) errors.categorySlug = "Choose a category.";
  if (!form.subcategory) errors.subcategory = "Choose a subcategory.";
  if (!form.description.trim()) errors.description = "A short description is required.";
  if (!form.image.trim() && !hasNewImages) errors.image = "At least one product image is required.";

  // Paint products need the core paint information before they can be published.
  if (form.categorySlug === "paints") {
    if (!form.packSizes.trim()) errors.packSizes = "Add at least one pack size.";
    if (!form.finish.trim()) errors.finish = "Finish is required for paint products.";
    if (!form.coverage.trim()) errors.coverage = "Coverage is required for paint products.";
  }

  return errors;
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [slides, setSlides] = useState([]);
  const [slideFile, setSlideFile] = useState(null);

  const formErrors = useMemo(
    () => validateProduct(form, Boolean(editingId), imageFiles.length > 0),
    [form, editingId, imageFiles]
  );
  const formReady = Object.keys(formErrors).length === 0;

  useEffect(() => {
    if (!supabase) {
      setCheckingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setCheckingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setCheckingAuth(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) { loadProducts(); loadSlides(); }
  }, [session]);

  async function login(event) {
    event.preventDefault();
    setLoginError("");

    if (!supabase) {
      setLoginError("Supabase is not configured. Add the Vercel environment variables first.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) setLoginError("The email or password is incorrect.");
  }

  async function logout() {
    await supabase?.auth.signOut();
  }

  async function loadProducts() {
    setLoadingProducts(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .order("featured", { ascending: false })
      .order("name", { ascending: true });

    if (fetchError) setError(fetchError.message);
    else setProducts(data || []);

    setLoadingProducts(false);
  }

  async function loadSlides() {
    const { data: slideData, error: slideError } = await supabase
      .from("homepage_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (slideError) setError(slideError.message);
    else setSlides(slideData || []);
  }

  function startNew() {
    setEditingId(null);
    setForm(EMPTY);
    setImageFiles([]);
    setGalleryImages([]);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function loadGalleryImages(productId) {
    const { data, error: galleryError } = await supabase
      .from("product_images")
      .select("id, image_url, sort_order, created_at")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (galleryError) {
      setError(galleryError.message);
      setGalleryImages([]);
      return;
    }

    setGalleryImages(data || []);
  }

  async function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      range: product.range || "",
      categorySlug: product.category_slug || "",
      subcategory: product.subcategory || "",
      description: product.description || "",
      longDescription: product.long_description || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : "",
      packSizes: Array.isArray(product.pack_sizes) ? product.pack_sizes.join(", ") : "",
      finish: product.finish || "",
      coverage: product.coverage || "",
      warranty: product.warranty || "",
      manufacturerUrl: product.manufacturer_url || "",
      image: product.image || "",
      available: product.available !== false,
      featured: product.featured === true,
    });
    setImageFiles([]);
    setError("");
    setNotice("");
    await loadGalleryImages(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImages(files) {
    const uploaded = [];

    for (const [index, file] of files.entries()) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = `${Date.now()}-${index}-${slugify(file.name.replace(/\.[^/.]+$/, "")) || "product"}.${ext}`;
      const path = `products/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push({ url: data.publicUrl, path });
    }

    return uploaded;
  }

  async function deleteGalleryImage(image) {
    if (!window.confirm("Remove this product image?")) return;

    setError("");
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    const marker = "/storage/v1/object/public/product-images/";
    const path = image.image_url.includes(marker)
      ? decodeURIComponent(image.image_url.split(marker)[1])
      : null;

    if (path) await supabase.storage.from("product-images").remove([path]);
    setGalleryImages((current) => current.filter((item) => item.id !== image.id));
    setNotice("Product image removed.");
  }

  async function saveProduct(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    const errors = validateProduct(form, Boolean(editingId), imageFiles.length > 0);
    if (Object.keys(errors).length) {
      const first = Object.values(errors)[0];
      setError(first);
      return;
    }

    setSaving(true);

    try {
      const uploadedImages = imageFiles.length ? await uploadImages(imageFiles) : [];
      const imageUrl = uploadedImages[0]?.url || form.image;
      if (!imageUrl) throw new Error("At least one product image is required.");

      const category = getCategory(form.categorySlug);
      const subcategory = category?.subcategories.find((item) => item.slug === form.subcategory);

      const payload = {
        slug: slugify(form.name),
        name: form.name.trim(),
        short: form.brand.trim().toUpperCase(),
        brand: form.brand.trim(),
        range: form.range.trim() || null,
        category: category?.name || form.categorySlug,
        category_slug: form.categorySlug,
        subcategory: form.subcategory,
        subcategory_name: subcategory?.name || form.subcategory,
        description: form.description.trim(),
        long_description: form.longDescription.trim() || form.description.trim(),
        features: parseList(form.features),
        pack_sizes: parseList(form.packSizes),
        finish: form.finish.trim() || null,
        coverage: form.coverage.trim() || null,
        warranty: form.warranty.trim() || null,
        manufacturer_url: form.manufacturerUrl.trim() || null,
        image: imageUrl,
        available: form.available,
        featured: form.featured,
      };

      let result;

      if (editingId) {
        result = await supabase.from("products").update(payload).eq("id", editingId);
      } else {
        result = await supabase.from("products").insert(payload).select("id").single();
      }

      if (result.error) throw result.error;

      const productId = editingId || result.data?.[0]?.id;
      if (!productId) throw new Error("Product was saved, but its ID could not be determined.");

      const galleryUploads = uploadedImages.slice(1);
      if (galleryUploads.length) {
        const { error: galleryError } = await supabase.from("product_images").insert(
          galleryUploads.map((item, index) => ({
            product_id: productId,
            image_url: item.url,
            sort_order: galleryImages.length + index,
          }))
        );
        if (galleryError) throw galleryError;
      }

      setNotice(editingId ? "Product updated successfully." : "Product added successfully.");
      setForm(EMPTY);
      setEditingId(null);
      setImageFiles([]);
      setGalleryImages([]);
      await loadProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (saveError) {
      setError(saveError.message || "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(product) {
    setError("");
    const { error: updateError } = await supabase
      .from("products")
      .update({ available: !product.available })
      .eq("id", product.id);

    if (updateError) setError(updateError.message);
    else {
      setNotice(product.available ? "Product hidden from the public catalogue." : "Product is live again.");
      loadProducts();
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(`Permanently delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setError("");
    const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);

    if (deleteError) setError(deleteError.message);
    else {
      setNotice("Product permanently deleted.");
      if (editingId === product.id) startNew();
      loadProducts();
    }
  }

  async function addSlide(event) {
    event.preventDefault();
    setError(""); setNotice("");
    if (!slideFile) { setError("Please choose a hero image."); return; }
    setSaving(true);
    try {
      const ext=slideFile.name.split(".").pop()?.toLowerCase()||"jpg";
      const path=`hero/${Date.now()}-${slugify(slideFile.name.replace(/\.[^/.]+$/, ""))}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("homepage-hero-images").upload(path, slideFile,{cacheControl:"3600",upsert:false,contentType:slideFile.type||"image/jpeg"});
      if(uploadError) throw uploadError;
      const {data:{publicUrl}}=supabase.storage.from("homepage-hero-images").getPublicUrl(path);
      const {error: insertError}=await supabase.from("homepage_slides").insert({image:publicUrl,sort_order:slides.length,active:true});
      if(insertError) throw insertError;
      setSlideFile(null); setNotice("Hero image added."); await loadSlides();
    } catch(e){setError(e.message||"Could not add hero image.");} finally{setSaving(false);}
  }
  async function toggleSlide(slide){ const {error:e}=await supabase.from("homepage_slides").update({active:!slide.active}).eq("id",slide.id); if(e)setError(e.message); else{setNotice(slide.active?"Hero image hidden.":"Hero image is live.");loadSlides();} }
  async function deleteSlide(slide){ if(!window.confirm("Remove this hero image?"))return; const {error:e}=await supabase.from("homepage_slides").delete().eq("id",slide.id); if(e)setError(e.message); else{setNotice("Hero image removed.");loadSlides();} }

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" && product.available) ||
        (statusFilter === "hidden" && !product.available);

      const haystack = `${product.name} ${product.brand} ${product.category} ${product.subcategory_name || ""}`.toLowerCase();
      return matchesStatus && (!q || haystack.includes(q));
    });
  }, [products, search, statusFilter]);

  const selectedCategory = getCategory(form.categorySlug);

  if (checkingAuth) {
    return <main className="admin-shell"><div className="admin-card">Loading admin…</div></main>;
  }

  if (!supabase) {
    return (
      <main className="admin-shell">
        <div className="admin-card admin-login">
          <p className="kicker orange-kicker">ADMIN</p>
          <h1>Setup required.</h1>
          <p>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to Vercel before using the admin.</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <div className="admin-card admin-login">
          <p className="kicker orange-kicker">SHRI MALLIKARJUN</p>
          <h1>Admin.</h1>
          <p className="admin-muted">Sign in to manage the product catalogue.</p>

          <form onSubmit={login} className="admin-form">
            <label>Email *<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
            <label>Password *<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
            {loginError ? <div className="admin-error">{loginError}</div> : null}
            <button className="btn btn-orange admin-submit" type="submit">SIGN IN</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p className="kicker orange-kicker">SHRI MALLIKARJUN</p>
            <h1>Product Manager.</h1>
            <p className="admin-muted">Add, update, hide or remove products without editing the website code.</p>
          </div>
          <button className="admin-secondary" onClick={logout}>SIGN OUT</button>
        </header>

        {notice ? <div className="admin-success">✓ {notice}</div> : null}
        {error ? <div className="admin-error">⚠ {error}</div> : null}

        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <p className="kicker">CATALOGUE</p>
              <h2>{editingId ? "Edit product." : "Add product."}</h2>
            </div>
            {editingId ? <button className="admin-secondary" type="button" onClick={startNew}>CANCEL EDIT</button> : null}
          </div>

          <form onSubmit={saveProduct} className="admin-form">
            <div className="admin-grid-2">
              <label>
                Product name *
                <input aria-invalid={Boolean(formErrors.name)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. One Inspire Clear Coat" />
                {formErrors.name ? <small className="admin-field-error">{formErrors.name}</small> : null}
              </label>

              <label>
                Brand *
                <input aria-invalid={Boolean(formErrors.brand)} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Birla Opus" />
                {formErrors.brand ? <small className="admin-field-error">{formErrors.brand}</small> : null}
              </label>

              <label>
                Product range
                <input value={form.range} onChange={(e) => setForm({ ...form, range: e.target.value })} placeholder="e.g. One" />
              </label>

              <label>
                Category *
                <select aria-invalid={Boolean(formErrors.categorySlug)} value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value, subcategory: "" })}>
                  <option value="">Choose category</option>
                  {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                </select>
                {formErrors.categorySlug ? <small className="admin-field-error">{formErrors.categorySlug}</small> : null}
              </label>

              <label>
                Subcategory *
                <select aria-invalid={Boolean(formErrors.subcategory)} value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} disabled={!selectedCategory}>
                  <option value="">{selectedCategory ? "Choose subcategory" : "Choose a category first"}</option>
                  {selectedCategory?.subcategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                {formErrors.subcategory ? <small className="admin-field-error">{formErrors.subcategory}</small> : null}
              </label>

              <label>
                Product images *
                <input
                  aria-invalid={Boolean(formErrors.image)}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                />
                <small>Choose multiple images at once. The first selected image becomes the main product image; the rest become the product gallery.</small>
                {form.image && !imageFiles.length ? <small>Current main image is saved. Choose files to replace the main image and add additional gallery images.</small> : null}
                {imageFiles.length ? <small>{imageFiles.length} new image{imageFiles.length === 1 ? "" : "s"} selected.</small> : null}
                {formErrors.image ? <small className="admin-field-error">{formErrors.image}</small> : null}
              </label>
            </div>

            {editingId && galleryImages.length ? (
              <div className="admin-gallery-manager">
                <div>
                  <p className="kicker">PRODUCT GALLERY</p>
                  <p className="admin-muted">Additional images saved for this product. The main image is managed above.</p>
                </div>
                <div className="admin-gallery-grid">
                  {galleryImages.map((image) => (
                    <div className="admin-gallery-item" key={image.id}>
                      <img src={image.image_url} alt="" />
                      <button type="button" className="danger" onClick={() => deleteGalleryImage(image)}>REMOVE</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <label>
              Short description *
              <textarea aria-invalid={Boolean(formErrors.description)} rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A clear one-sentence product description." />
              {formErrors.description ? <small className="admin-field-error">{formErrors.description}</small> : null}
            </label>

            <label>
              Full description
              <textarea rows="5" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} placeholder="Additional product information." />
            </label>

            <div className="admin-divider">
              <p className="kicker">PRODUCT DETAILS</p>
              <p className="admin-muted">Fields marked optional can be left blank when the manufacturer does not provide that information.</p>
            </div>

            <div className="admin-grid-2">
              <label>
                Features <span>(optional)</span>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Anti-fungal, Low odour, Washable" />
                <small>Separate multiple features with commas.</small>
              </label>

              <label>
                Pack sizes {form.categorySlug === "paints" ? "*" : "(optional)"}
                <input aria-invalid={Boolean(formErrors.packSizes)} value={form.packSizes} onChange={(e) => setForm({ ...form, packSizes: e.target.value })} placeholder="1L, 4L, 10L, 20L" />
                <small>Separate sizes with commas.</small>
                {formErrors.packSizes ? <small className="admin-field-error">{formErrors.packSizes}</small> : null}
              </label>

              <label>
                Finish {form.categorySlug === "paints" ? "*" : "(optional)"}
                <input aria-invalid={Boolean(formErrors.finish)} value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} placeholder="Matt, Satin, Gloss..." />
                {formErrors.finish ? <small className="admin-field-error">{formErrors.finish}</small> : null}
              </label>

              <label>
                Coverage {form.categorySlug === "paints" ? "*" : "(optional)"}
                <input aria-invalid={Boolean(formErrors.coverage)} value={form.coverage} onChange={(e) => setForm({ ...form, coverage: e.target.value })} placeholder="120–140 sq. ft./litre" />
                {formErrors.coverage ? <small className="admin-field-error">{formErrors.coverage}</small> : null}
              </label>

              <label>
                Warranty / guarantee <span>(optional)</span>
                <input value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} placeholder="5 years" />
              </label>

              <label>
                Manufacturer URL <span>(optional)</span>
                <input type="url" value={form.manufacturerUrl} onChange={(e) => setForm({ ...form, manufacturerUrl: e.target.value })} placeholder="https://..." />
              </label>
            </div>

            <div className="admin-toggles">
              <label className="admin-check"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> <span><strong>Live on website</strong><small>Turn this off to hide the product without deleting it.</small></span></label>
              <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> <span><strong>Featured product</strong><small>Allows the product to appear in featured product sections.</small></span></label>
            </div>

            <button
              className="btn btn-orange admin-submit"
              type="submit"
              disabled={saving || !formReady}
              title={!formReady ? "Complete all required fields before saving." : ""}
            >
              {saving ? "SAVING…" : editingId ? "SAVE CHANGES" : "ADD PRODUCT"}
            </button>
            {!formReady ? (
              <p className="admin-required-note">Complete the highlighted required fields before saving.</p>
            ) : null}
          </form>
        </section>

        <section className="admin-card">
          <div className="admin-section-head"><div><p className="kicker">HOMEPAGE</p><h2>Hero images.</h2></div></div>
          <form onSubmit={addSlide} className="admin-form">
            <label>Hero image *<input type="file" accept="image/*" onChange={e=>setSlideFile(e.target.files?.[0]||null)} /></label>
            <button className="btn btn-orange admin-submit" type="submit" disabled={saving}>{saving?"UPLOADING…":"ADD HERO IMAGE"}</button>
          </form>
          <div className="admin-slide-list">
            {slides.map(slide=><article className="admin-slide-row" key={slide.id}><img src={slide.image} alt=""/><div><strong>{slide.title||"Hero image"}</strong><span>{slide.active?"LIVE":"HIDDEN"}</span></div><button onClick={()=>toggleSlide(slide)}>{slide.active?"HIDE":"SHOW"}</button><button className="danger" onClick={()=>deleteSlide(slide)}>DELETE</button></article>)}
            {!slides.length?<p className="admin-muted">No custom hero images yet. The current site hero will remain visible until you add one.</p>:null}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <p className="kicker">MANAGE</p>
              <h2>Products.</h2>
            </div>
            <button className="btn btn-orange" type="button" onClick={startNew}>+ ADD PRODUCT</button>
          </div>

          <div className="admin-list-tools">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All products</option>
              <option value="live">Live</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          {loadingProducts ? <p className="admin-muted">Loading products…</p> : null}

          <div className="admin-product-list">
            {filteredProducts.map((product) => (
              <article className="admin-product-row" key={product.id}>
                <div className="admin-product-thumb">
                  {product.image ? <img src={product.image} alt="" /> : <span>{product.short || "PRODUCT"}</span>}
                </div>
                <div className="admin-product-main">
                  <strong>{product.name}</strong>
                  <span>{product.brand || "No brand"} · {product.subcategory_name || product.subcategory}</span>
                </div>
                <span className={`admin-status ${product.available ? "live" : "hidden"}`}>
                  {product.available ? "LIVE" : "HIDDEN"}
                </span>
                <div className="admin-row-actions">
                  <button onClick={() => startEdit(product)}>EDIT</button>
                  <button onClick={() => toggleAvailability(product)}>{product.available ? "HIDE" : "SHOW"}</button>
                  <button className="danger" onClick={() => deleteProduct(product)}>DELETE</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
