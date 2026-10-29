/**
 * Portfolio JavaScript - Nischay Jain
 * High-Performance Interactive Features:
 * 1. Three.js 3D Cyber Core (Morphable geometries, Orbiting particles, Drag-to-rotate)
 * 2. 3D Card Tilt with Dynamic Specular Glare
 * 3. 3D Scroll Reveal & Entrance Animations
 * 4. Ambient 3D Mouse Parallax on Glow Orbs
 * 5. Codeforces 153-Problem Heatmap Animation
 * 6. CTF Flag Verifier Simulator with 3D Celebration
 * 7. Copy-to-Clipboard Toast & Mobile Navigation Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. Navigation: Scroll Effects & Mobile Drawer
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // =========================================================================
  // 2. Three.js Interactive 3D Cyber Core Hologram
  // =========================================================================
  const canvas = document.getElementById('cyber3dCanvas');
  const canvasContainer = document.getElementById('canvasContainer');
  const morphBtn = document.getElementById('morphGeometryBtn');
  const shapeLabel = document.getElementById('currentShapeLabel');
  const wireframeBtn = document.getElementById('toggleWireframeBtn');
  const resetBtn = document.getElementById('reset3dViewBtn');

  let triggerCelebrationSpin = null;

  if (canvas && canvasContainer && typeof THREE !== 'undefined') {
    const width = canvasContainer.clientWidth || 380;
    const height = canvasContainer.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 2.5, 15);
    pointLightCyan.position.set(4, 4, 4);
    scene.add(pointLightCyan);

    const pointLightTeal = new THREE.PointLight(0x00e599, 2.0, 15);
    pointLightTeal.position.set(-4, -4, 3);
    scene.add(pointLightTeal);

    // Group for all rotating elements
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Geometries library for morphing
    const shapes = [
      { name: 'Icosahedron', create: () => new THREE.IcosahedronGeometry(1.8, 1) },
      { name: 'Torus Knot', create: () => new THREE.TorusKnotGeometry(1.1, 0.35, 70, 14) },
      { name: 'Octahedron', create: () => new THREE.OctahedronGeometry(1.8, 0) },
      { name: 'Dodecahedron', create: () => new THREE.DodecahedronGeometry(1.7, 0) }
    ];
    let currentShapeIndex = 0;

    // Materials
    let renderMode = 0; // 0: wireframe + solid core, 1: points cloud, 2: cyber glossy
    const wireframeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });

    const innerCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00e599,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.35
    });

    // Outer and Inner Meshes
    let outerMesh = new THREE.Mesh(shapes[0].create(), wireframeMaterial);
    let innerMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), innerCoreMaterial);
    coreGroup.add(outerMesh);
    coreGroup.add(innerMesh);

    // Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(2.7, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    coreGroup.add(ring2);

    // Orbiting 3D Particle Cloud
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // Mouse Interaction / Drag State
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0.4;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    let celebrationTimer = 0;

    const onPointerDown = (clientX, clientY) => {
      isDragging = true;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging) return;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      rotationVelocityY = deltaX * 0.007;
      rotationVelocityX = deltaY * 0.007;

      targetRotationY += rotationVelocityY;
      targetRotationX += rotationVelocityX;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvasContainer.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    canvasContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);

    // Zoom on wheel over canvas
    canvasContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.003;
      camera.position.z = Math.min(Math.max(camera.position.z, 3.8), 8.5);
    }, { passive: false });

    // Morph Shape Button Handler
    if (morphBtn) {
      morphBtn.addEventListener('click', () => {
        currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
        const nextShape = shapes[currentShapeIndex];
        
        coreGroup.remove(outerMesh);
        outerMesh.geometry.dispose();
        outerMesh = new THREE.Mesh(nextShape.create(), wireframeMaterial);
        coreGroup.add(outerMesh);

        if (shapeLabel) {
          shapeLabel.textContent = nextShape.name;
        }

        // Pulse scale animation
        coreGroup.scale.set(1.15, 1.15, 1.15);
        setTimeout(() => coreGroup.scale.set(1, 1, 1), 220);
      });
    }

    // Toggle Wireframe / Material Mode
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        renderMode = (renderMode + 1) % 3;
        if (renderMode === 0) {
          wireframeMaterial.wireframe = true;
          wireframeMaterial.opacity = 0.85;
          innerMesh.visible = true;
        } else if (renderMode === 1) {
          wireframeMaterial.wireframe = true;
          wireframeMaterial.opacity = 0.45;
          innerMesh.visible = false;
        } else {
          wireframeMaterial.wireframe = false;
          wireframeMaterial.opacity = 0.75;
          innerMesh.visible = true;
        }
      });
    }

    // Reset View Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        targetRotationX = 0.2;
        targetRotationY = 0.4;
        camera.position.z = 6.2;
        coreGroup.rotation.set(0, 0, 0);
      });
    }

    // Trigger celebration spin when CTF flag verified
    triggerCelebrationSpin = () => {
      celebrationTimer = 90; // ~1.5 seconds at 60fps
      pointLightTeal.intensity = 5.0;
      pointLightCyan.intensity = 5.0;
      setTimeout(() => {
        pointLightTeal.intensity = 2.0;
        pointLightCyan.intensity = 2.5;
      }, 1600);
    };

    // Resize Observer
    const handleResize = () => {
      const newWidth = canvasContainer.clientWidth;
      const newHeight = canvasContainer.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate3D = () => {
      requestAnimationFrame(animate3D);

      const delta = clock.getDelta();

      // Celebration spin boost
      if (celebrationTimer > 0) {
        targetRotationY += 0.08;
        coreGroup.rotation.z += 0.04;
        celebrationTimer--;
      } else if (!isDragging && !isReduced) {
        targetRotationY += 0.005;
        targetRotationX += Math.sin(clock.getElapsedTime() * 0.5) * 0.001;
      }

      // Smooth damping interpolation
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.08;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.08;

      // Orbiting rings animation
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;
      particles.rotation.y -= 0.003;

      renderer.render(scene, camera);
    };
    animate3D();
  }

  // =========================================================================
  // 3. Interactive 3D Card Tilt with Dynamic Specular Glare
  // =========================================================================
  const tiltSelectors = [
    '.tilt-3d',
    '.stat-card',
    '.skill-category',
    '.project-card',
    '.contact-card',
    '.about-narrative',
    '.education-card',
    '.beyond-card',
    '.ctf-intro-card',
    '.ctf-interactive',
    '.cp-dashboard'
  ];

  const tiltCards = document.querySelectorAll(tiltSelectors.join(', '));

  if (!isReduced) {
    tiltCards.forEach(card => {
      // Avoid duplicate glare layer
      if (!card.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.classList.add('tilt-3d');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px) scale3d(1.018, 1.018, 1.018)`;

        const glare = card.querySelector('.tilt-glare');
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 240, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
      });
    });
  }

  // =========================================================================
  // 4. 3D Scroll Reveal & Entrance Transitions
  // =========================================================================
  const revealTargets = document.querySelectorAll(`
    .section-title,
    .section-subtitle,
    .stat-card,
    .about-narrative,
    .education-card,
    .beyond-card,
    .skill-category,
    .cp-dashboard,
    .ctf-intro-card,
    .ctf-interactive,
    .project-card,
    .contact-wrapper
  `);

  revealTargets.forEach((el, idx) => {
    el.classList.add('reveal-3d');
    const delayClass = `reveal-delay-${(idx % 4) + 1}`;
    el.classList.add(delayClass);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('active'));
  }

  // =========================================================================
  // 5. Interactive Mouse Parallax on Background Glow Orbs
  // =========================================================================
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (!isReduced && (orb1 || orb2 || orb3)) {
    window.addEventListener('mousemove', (e) => {
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.025;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.025;

      if (orb1) orb1.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      if (orb2) orb2.style.transform = `translate3d(${-offsetX * 1.4}px, ${-offsetY * 1.4}px, 0)`;
      if (orb3) orb3.style.transform = `translate3d(${offsetX * 0.8}px, ${-offsetY * 0.8}px, 0)`;
    }, { passive: true });
  }

  // =========================================================================
  // 6. Codeforces Problem Heatmap Grid (153 Problems)
  // =========================================================================
  const cfGrid = document.getElementById('codeforcesGrid');
  const TOTAL_SOLVED = 153;

  if (cfGrid) {
    for (let i = 0; i <= TOTAL_SOLVED; i++) {
      const tile = document.createElement('i');
      if (i === TOTAL_SOLVED) {
        tile.className = 'current';
        tile.title = `Next Problem (#${i + 1}) - In Progress`;
      } else {
        tile.className = isReduced ? 'solved' : '';
        tile.title = `Codeforces Problem #${i + 1} Conquered`;
      }
      cfGrid.appendChild(tile);
    }

    if (!isReduced) {
      const tiles = cfGrid.querySelectorAll('i:not(.current)');
      let index = 0;
      const animateGrid = () => {
        const batch = 4;
        for (let b = 0; b < batch && index < tiles.length; b++) {
          tiles[index].classList.add('solved');
          index++;
        }
        if (index < tiles.length) {
          requestAnimationFrame(animateGrid);
        }
      };
      setTimeout(animateGrid, 250);
    }
  }

  // =========================================================================
  // 7. CTF Flag Verification Simulator with 3D Celebration
  // =========================================================================
  const flagInput = document.getElementById('flagInput');
  const verifyFlagBtn = document.getElementById('verifyFlagBtn');
  const flagOutput = document.getElementById('flagOutput');

  if (verifyFlagBtn && flagInput && flagOutput) {
    const validFlags = [
      'flag{nischay_ctf_2024}',
      'flag{nischay_cyber_pro}',
      'flag{insane_nischay_flag}',
      'flag{nj_sec_verified}'
    ];

    const checkFlag = () => {
      const val = flagInput.value.trim().toLowerCase();
      if (!val) {
        flagOutput.className = 'flag-output error';
        flagOutput.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error: Flag payload cannot be empty.';
        return;
      }

      if (validFlags.includes(val) || val.startsWith('flag{')) {
        flagOutput.className = 'flag-output success';
        flagOutput.innerHTML = '<i class="fa-solid fa-circle-check"></i> [ACCESS GRANTED]: Flag authenticated! Hash integrity validated.';

        // Trigger 3D Cyber Core spin celebration if available!
        if (triggerCelebrationSpin) {
          triggerCelebrationSpin();
        }
      } else {
        flagOutput.className = 'flag-output error';
        flagOutput.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> [ACCESS DENIED]: Invalid signature. Try format: <code>flag{...}</code>';
      }
    };

    verifyFlagBtn.addEventListener('click', checkFlag);
    flagInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkFlag();
      }
    });
  }

  // =========================================================================
  // 8. Quick Email Copy to Clipboard with Toast
  // =========================================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');
  const emailToCopy = 'jainnischay66@gmail.com';

  if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      navigator.clipboard.writeText(emailToCopy).then(() => {
        toast.textContent = `Copied "${emailToCopy}" to clipboard!`;
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3200);
      }).catch(() => {
        prompt('Copy email:', emailToCopy);
      });
    });
  }

  // =========================================================================
  // 9. Smooth Scroll on Anchor Links
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
