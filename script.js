(function(){
  'use strict';

  // Nav active + scroll
  const sections = document.querySelectorAll('.slide');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navbar = document.getElementById('navbar');

  function updateNav(){
    const sp = window.scrollY + navbar.offsetHeight + 60;
    sections.forEach((sec,i)=>{
      if(sp >= sec.offsetTop && sp < sec.offsetTop + sec.offsetHeight){
        navLinks.forEach(l=>l.classList.remove('active'));
        if(navLinks[i]) navLinks[i].classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateNav, {passive:true});

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal,.reveal-l,.reveal-r');
  const ro = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  reveals.forEach(el=>ro.observe(el));

  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  let open = false;
  toggle.addEventListener('click',()=>{
    open = !open;
    if(open){
      Object.assign(navLinksEl.style,{display:'flex',flexDirection:'column',position:'absolute',
        top:'60px',left:'0',right:'0',background:'rgba(214,207,196,0.98)',
        padding:'1.5rem 2rem',borderBottom:'1px solid #b8ae9e',backdropFilter:'blur(10px)'});
    } else {
      navLinksEl.removeAttribute('style');
    }
  });
  navLinks.forEach(l=>l.addEventListener('click',()=>{if(open){toggle.click()}}));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if(t) window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-navbar.offsetHeight,behavior:'smooth'});
    });
  });

  // Contact form — FormSubmit
  document.getElementById('contactForm').addEventListener('submit',function(e){
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = this.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    const data = new FormData(this);
    btn.textContent='Envoi en cours...'; btn.disabled=true; btn.style.opacity='.6';
    fetch('https://formsubmit.co/ajax/franckrayan226@gmail.com',{
      method:'POST',
      headers:{'Accept':'application/json'},
      body:data
    }).then(r=>r.json()).then(res=>{
      if(res.success==='true'||res.success===true){
        status.textContent='Message envoye avec succes. Merci !';
        status.className='form-status ok';
        this.reset();
      } else {
        status.textContent="Erreur lors de l'envoi. Veuillez reessayer.";
        status.className='form-status err';
      }
      btn.textContent=orig; btn.disabled=false; btn.style.opacity='';
    }).catch(()=>{
      status.textContent="Erreur reseau. Veuillez reessayer.";
      status.className='form-status err';
      btn.textContent=orig; btn.disabled=false; btn.style.opacity='';
    });
  });

})();