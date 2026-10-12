
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText);
window.addEventListener("load", () => {
  const videoHero = document.querySelector(".hero video");
  const videoFooter = document.querySelector("footer video");



  videoHero.src = "/img/video-hero.mp4";
  videoHero.autoPlay = true;
  videoHero.loop = true;
  videoHero.muted = true

videoFooter.src = "/img/video-footer.mp4";
  videoFooter.autoPlay = true;
  videoFooter.loop = true;
  videoFooter.muted = true

  //QUANDO ROLO A PAGINA CADA RETANGULO DESCE

  //LINHA DO TEMPO

  const linhaDoTempo = gsap.timeline({
    scrollTrigger: {
      trigger: ".transicao",
      markers: false,
      scrub: 2,
      start: "0% 0%",
      end: "+=3000",
      pin: true,
    },
  });

  linhaDoTempo.to(".retangulos div", {
    y: 0,
    stagger: 0.2,
    duration: 4,
  });

  linhaDoTempo.to(".secao2", {
    opacity: 1,
    duration: 0.1,
  });

  linhaDoTempo.from(".secao2 h2", {
    y: 200,
  });

  const split = new SplitText(".secao2 h2", {
    types: "chars",
    mask: "lines",
  });
  linhaDoTempo.from(split.chars, {
    y: 100,
    stagger: 0.01,
    duration: 1,
  });


  // Animacoes do texto surgindo do diamante

  const linhaDoTempo2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".transicao2",
      markers: false,
      scrub: 2,
      start: "top top",
      end: "+=4200",
    },
  });

  gsap.utils.toArray(".secao4 h2").forEach((titulo) => {
    const letras = new SplitText(titulo, { types: "chars" }).chars;

    linhaDoTempo2.fromTo(
      letras,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: { each: 0.04, from: "random" },
        ease: "power2.out",
      },
    );

    linhaDoTempo2.to(letras, {
      opacity: 0,
      y: -40,
      duration: 0.35,
      stagger: { each: 0.04, from: "random" },
      ease: "power2.in",
    }, "+=0.25");
  });

  //comecando a usar three.js

  //CENA
  const cena = new THREE.Scene();

  //CAMERA
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;
  //RENDEriZADOR
  const renderizador = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderizador.setSize(window.innerWidth, window.innerHeight);

  const divDiamante = document.querySelector(".divDiamante");
  divDiamante.appendChild(renderizador.domElement);

  //Inserir objeto 3D
  let diamante = null;
  const glftLoader = new GLTFLoader();
  glftLoader.load("/img/diamond-compressed.glb", (objeto) => {
    diamante = objeto.scene;
    diamante.position.z = -8;
    diamante.position.y = 2;

    if (window.innerWidth < 700) { 
      diamante.position.z = -2;
    }

    const linhaDoTempo3 = gsap.timeline({
        scrollTrigger: {
          trigger: ".transicao2",
          scrub: 2,
          start: "top top",
          end: "+=4200",
          pin: true,
        },
      });

    linhaDoTempo3.to(diamante.position, {
      y: 0,
      duration: 2,
    });

    linhaDoTempo3.to(diamante.rotation, {
      x: 4.6,
      duration: 2,
    }, "<");
    linhaDoTempo3.to(diamante.position, {
      z: 3.3,
      duration: 0.3
    })
    linhaDoTempo3.to("footer", {
      opacity: 1,
      duration: 0.3
    })

    cena.add(diamante);
  });

  //INSERIR TEXTURA
  const txtLoader = new THREE.TextureLoader();
  txtLoader.load("/img/hdri.webp", (texturaCarregada) => {
    texturaCarregada.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderizador);
    const ambiente = pmrem.fromEquirectangular(texturaCarregada).texture;
    cena.environment = ambiente;
  }); 


  function animar() {

    if( diamante !== null) {
      diamante.rotation.y = diamante.rotation.y + 0.01;
    }
    renderizador.render(cena, camera);
    requestAnimationFrame(animar);
  }

  animar();
});