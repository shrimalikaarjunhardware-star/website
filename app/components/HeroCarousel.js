"use client";
import { useEffect, useState } from "react";
export function HeroCarousel({ slides, fallback }) {
  const items=slides?.length?slides:[{image:fallback,title:"",subtitle:""}];
  const [index,setIndex]=useState(0);
  useEffect(()=>{ if(items.length<2) return; const id=setInterval(()=>setIndex(i=>(i+1)%items.length),6000); return()=>clearInterval(id);},[items.length]);
  return <div className="hero-carousel" aria-label="Featured store images">
    {items.map((slide,i)=><div className={`hero-slide ${i===index?"active":""}`} key={`${slide.image}-${i}`} style={{backgroundImage:`url(${slide.image})`}} aria-hidden={i!==index}/>) }
    {items.length>1?<div className="hero-dots">{items.map((_,i)=><button key={i} aria-label={`Show slide ${i+1}`} className={i===index?"active":""} onClick={()=>setIndex(i)} />)}</div>:null}
  </div>;
}
