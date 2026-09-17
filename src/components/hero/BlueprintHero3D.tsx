import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, Compass, Layers, Eye, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { HexPattern } from '../common/HexPattern';

interface BlueprintHero3DProps {
  onExploreProperties: () => void;
  lang: 'en' | 'es';
}

export const BlueprintHero3D: React.FC<BlueprintHero3DProps> = ({
  onExploreProperties,
  lang
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<number>(0); // 0: Blueprint, 1: Wireframe 3D, 2: Solid Architecture, 3: Real Property
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Chapter labels
  const chapters = [
    {
      num: '01',
      titleEn: 'The Blueprint',
      titleEs: 'El Plano',
      descEn: 'Architectural geometry rooted in brand identity',
      descEs: 'Geometría arquitectónica nacida de la marca'
    },
    {
      num: '02',
      titleEn: '3D Wireframe',
      titleEs: 'Malla 3D',
      descEn: 'Extruding the twin-gable house into 3D space',
      descEs: 'Extrusión de la doble caída en espacio tridimensional'
    },
    {
      num: '03',
      titleEn: 'Architecture',
      titleEs: 'Arquitectura',
      descEn: 'Materialization, volumetric light & glass facades',
      descEs: 'Materialización, luz volumétrica y fachadas de cristal'
    },
    {
      num: '04',
      titleEn: 'New Era Property',
      titleEs: 'Propiedad New Era',
      descEn: 'A New Era of Real Estate in Kentucky',
      descEs: 'Una Nueva Era de Bienes Raíces en Kentucky'
    }
  ];

  // Auto-progression through stages when idle, or scroll/click triggered
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0d10, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for the entire architectural house model
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // 1. Foundation Grid (Blueprint CAD lines)
    const gridHelper = new THREE.GridHelper(24, 24, 0x721623, 0x1f242d);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 2. Twin Gables House Geometry (Exact Brand Geometry)
    // Left Gable & Right Gable matching New Era logo
    const createWireframeHouse = () => {
      const wireframeGroup = new THREE.Group();

      // Brand colors in Three.js
      const brandWine = 0x8c1c2c;
      const brandOrange = 0xe64a2a;
      const lineMaterial = new THREE.LineBasicMaterial({
        color: brandWine,
        linewidth: 2,
        transparent: true,
        opacity: 0.9
      });
      const highlightLineMaterial = new THREE.LineBasicMaterial({
        color: brandOrange,
        linewidth: 3,
        transparent: true,
        opacity: 1
      });

      // Left House Body + Gable Roof
      // Points for Left Gable: width 3.2, height 3.5, roof peak at (0, 5, 0)
      const leftGablePoints = [
        new THREE.Vector3(-3.2, -2, 2),
        new THREE.Vector3(-3.2, 1.8, 2),
        new THREE.Vector3(-0.8, 3.8, 2), // Left ridge
        new THREE.Vector3(0.2, 4.8, 2),  // Central peak
        new THREE.Vector3(0.2, -2, 2),
        new THREE.Vector3(-3.2, -2, 2),
        // Back face
        new THREE.Vector3(-3.2, -2, -3),
        new THREE.Vector3(-3.2, 1.8, -3),
        new THREE.Vector3(-0.8, 3.8, -3),
        new THREE.Vector3(0.2, 4.8, -3),
        new THREE.Vector3(0.2, -2, -3),
        new THREE.Vector3(-3.2, -2, -3),
      ];
      const leftGeom = new THREE.BufferGeometry().setFromPoints(leftGablePoints);
      const leftLine = new THREE.Line(leftGeom, highlightLineMaterial);
      wireframeGroup.add(leftLine);

      // Connecting rafters
      const connectPoints = [
        new THREE.Vector3(-3.2, 1.8, 2), new THREE.Vector3(-3.2, 1.8, -3),
        new THREE.Vector3(-0.8, 3.8, 2), new THREE.Vector3(-0.8, 3.8, -3),
        new THREE.Vector3(0.2, 4.8, 2), new THREE.Vector3(0.2, 4.8, -3),
        new THREE.Vector3(0.2, -2, 2), new THREE.Vector3(0.2, -2, -3),
      ];
      const connectGeom = new THREE.BufferGeometry().setFromPoints(connectPoints);
      const connectLines = new THREE.LineSegments(connectGeom, lineMaterial);
      wireframeGroup.add(connectLines);

      // Right House Wing & Asymmetric Roofline (Brand Twin Gable)
      const rightGablePoints = [
        new THREE.Vector3(0.2, -2, 2),
        new THREE.Vector3(0.2, 4.8, 2),
        new THREE.Vector3(3.4, 2.2, 2), // Right downward pitch
        new THREE.Vector3(3.4, -2, 2),
        new THREE.Vector3(0.2, -2, 2),
        // Back
        new THREE.Vector3(0.2, -2, -3),
        new THREE.Vector3(0.2, 4.8, -3),
        new THREE.Vector3(3.4, 2.2, -3),
        new THREE.Vector3(3.4, -2, -3),
        new THREE.Vector3(0.2, -2, -3),
      ];
      const rightGeom = new THREE.BufferGeometry().setFromPoints(rightGablePoints);
      const rightLine = new THREE.Line(rightGeom, highlightLineMaterial);
      wireframeGroup.add(rightLine);

      // Right roof connector
      const rightConnect = [
        new THREE.Vector3(3.4, 2.2, 2), new THREE.Vector3(3.4, 2.2, -3),
        new THREE.Vector3(3.4, -2, 2), new THREE.Vector3(3.4, -2, -3),
      ];
      const rightConnectGeom = new THREE.BufferGeometry().setFromPoints(rightConnect);
      const rightConnectLines = new THREE.LineSegments(rightConnectGeom, lineMaterial);
      wireframeGroup.add(rightConnectLines);

      // Floor plan & interior partition lines
      const floorPoints = [
        new THREE.Vector3(-1.8, -2, 2), new THREE.Vector3(-1.8, 1.2, 2),
        new THREE.Vector3(-1.8, 1.2, -3), new THREE.Vector3(-1.8, -2, -3),
        new THREE.Vector3(1.6, -2, 2), new THREE.Vector3(1.6, 1.2, 2),
        new THREE.Vector3(1.6, 1.2, -3), new THREE.Vector3(1.6, -2, -3),
      ];
      const floorGeom = new THREE.BufferGeometry().setFromPoints(floorPoints);
      const floorLines = new THREE.LineSegments(floorGeom, lineMaterial);
      wireframeGroup.add(floorLines);

      // Glowing vertex nodes (CAD measurement markers)
      const nodePoints = [
        new THREE.Vector3(0.2, 4.8, 2),
        new THREE.Vector3(-0.8, 3.8, 2),
        new THREE.Vector3(-3.2, 1.8, 2),
        new THREE.Vector3(3.4, 2.2, 2),
        new THREE.Vector3(-3.2, -2, 2),
        new THREE.Vector3(3.4, -2, 2),
        new THREE.Vector3(0.2, 4.8, -3),
      ];
      const nodeGeom = new THREE.BufferGeometry().setFromPoints(nodePoints);
      const nodeMat = new THREE.PointsMaterial({
        color: 0xe64a2a,
        size: 0.25,
        transparent: true,
        opacity: 0.95
      });
      const nodes = new THREE.Points(nodeGeom, nodeMat);
      wireframeGroup.add(nodes);

      return wireframeGroup;
    };

    const wireframe = createWireframeHouse();
    houseGroup.add(wireframe);

    // 3. Volumetric Glass & Solid Facades (Stage 2: Architecture)
    const solidGroup = new THREE.Group();

    // Architectural Glass Pane Material (Warm reflections)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x272c35,
      emissive: 0x721623,
      emissiveIntensity: 0.15,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.5
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b1e24,
      roughness: 0.8,
      metalness: 0.2
    });

    // Glass curtain facade
    const glassGeometry = new THREE.PlaneGeometry(6.4, 4.5);
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.position.set(0.1, 0.4, 2.01);
    solidGroup.add(glassMesh);

    // Interior Warm Glow Lamp
    const interiorLight = new THREE.PointLight(0xf06143, 2.5, 12);
    interiorLight.position.set(0, 1.5, 0);
    solidGroup.add(interiorLight);

    houseGroup.add(solidGroup);

    // Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0xe64a2a, 3, 20);
    accentLight.position.set(-6, 4, 8);
    scene.add(accentLight);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation + parallax
      const targetRotationY = (mousePos.x * 0.4) + (elapsedTime * 0.12);
      const targetRotationX = (mousePos.y * 0.15) + 0.1;

      houseGroup.rotation.y += (targetRotationY - houseGroup.rotation.y) * 0.05;
      houseGroup.rotation.x += (targetRotationX - houseGroup.rotation.x) * 0.05;

      // Stage-specific visual modifications
      if (stage === 0) {
        // Blueprint: Pure flat 2D/isometric view, solid invisible
        solidGroup.visible = false;
        camera.position.lerp(new THREE.Vector3(0, 2, 12), 0.05);
        gridHelper.position.y = -2;
      } else if (stage === 1) {
        // Wireframe 3D: Perspective extrusion
        solidGroup.visible = false;
        camera.position.lerp(new THREE.Vector3(5, 5, 11), 0.05);
      } else if (stage === 2) {
        // Architecture: Solid walls & glowing glass illuminated
        solidGroup.visible = true;
        camera.position.lerp(new THREE.Vector3(-4, 3, 9), 0.05);
      } else {
        // Real Property: Dramatic close cinematic sweep
        solidGroup.visible = true;
        camera.position.lerp(new THREE.Vector3(1, 1.5, 7), 0.05);
      }

      camera.lookAt(0, 1, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [stage, mousePos]);

  // Mouse move parallax listener
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--color-charcoal-950)',
        color: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'var(--header-height)'
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Background Architectural Vector Pattern */}
      <HexPattern variant="gradient-glow" opacity={0.16} size={320} />

      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          cursor: 'grab'
        }}
      />

      {/* Stage 3/4 Real Property Crossfade Image Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'radial-gradient(circle at 60% 40%, rgba(114, 22, 35, 0.45) 0%, rgba(12, 13, 16, 0.85) 60%, var(--color-charcoal-950) 100%), url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: stage === 3 ? 0.88 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Architectural Technical Markers */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--color-orange-accent)',
                borderRadius: '50%',
                boxShadow: '0 0 12px var(--color-orange-accent)'
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              LOUISVILLE, KY • 38.2527° N, 85.7585° W
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.4)'
            }}
          >
            GLAR MLS ARCHITECTURE // ELEV +460FT
          </span>
        </div>

        {/* Brand House Monogram */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(18, 20, 24, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <BrandLogo variant="monogram-white" height={22} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#FFFFFF'
            }}
          >
            Digital Blueprint 2.0
          </span>
        </div>
      </div>

      {/* Main Hero Editorial Typography */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          margin: 'auto 0',
          maxWidth: '960px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="tag-badge tag-badge-accent">
              <Sparkles size={12} style={{ marginRight: '4px' }} />
              {lang === 'es' ? 'Transformación Inmobiliaria' : 'Architectural Real Estate'}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              CHAPTER {chapters[stage].num} / 04
            </span>
          </div>

          <h1
            className="display-hero"
            style={{
              color: '#FFFFFF',
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.6)'
            }}
          >
            {lang === 'es' ? (
              <>
                UNA NUEVA ERA DE <br />
                <span
                  style={{
                    color: 'var(--color-orange-accent)',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  BIENES RAÍCES.
                </span>
              </>
            ) : (
              <>
                A NEW ERA OF <br />
                <span
                  style={{
                    color: 'var(--color-orange-accent)',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  REAL ESTATE.
                </span>
              </>
            )}
          </h1>

          <p
            className="editorial-lead"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '640px'
            }}
          >
            {lang === 'es'
              ? 'Elevamos la representación inmobiliaria a través de diseño arquitectónico, inteligencia analítica y un compromiso humano sin precedentes en Kentucky e Indiana.'
              : 'Evolving real estate representation through architectural clarity, deep market intelligence, and human precision across Greater Louisville.'}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              alignItems: 'center',
              marginTop: '1rem'
            }}
          >
            <button
              onClick={onExploreProperties}
              className="btn-primary"
              style={{
                padding: '1.15rem 2.5rem',
                fontSize: '0.9rem'
              }}
            >
              <span>{lang === 'es' ? 'EXPLORAR PROPIEDADES' : 'FIND YOUR NEXT ERA'}</span>
              <Compass size={18} />
            </button>

            <button
              onClick={() => {
                setAutoPlay(false);
                setStage((prev) => (prev + 1) % 4);
              }}
              className="btn-outline btn-outline-white"
              style={{
                padding: '1.15rem 2rem',
                fontSize: '0.85rem'
              }}
            >
              <Layers size={16} />
              <span>
                {lang === 'es'
                  ? `Siguiente Fase: ${chapters[(stage + 1) % 4].titleEs}`
                  : `Next Stage: ${chapters[(stage + 1) % 4].titleEn}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Scrubber Navigation (Bottom Bar) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(12, 13, 16, 0.75)',
          backdropFilter: 'blur(12px)',
          padding: '1.25rem 0'
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          {chapters.map((chap, idx) => {
            const isActive = stage === idx;
            return (
              <button
                key={chap.num}
                onClick={() => {
                  setAutoPlay(false);
                  setStage(idx);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  textAlign: 'left',
                  padding: '0.5rem 0',
                  borderTop: isActive
                    ? '2px solid var(--color-orange-accent)'
                    : '2px solid transparent',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-orange-accent)' : 'rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    {chap.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    {lang === 'es' ? chap.titleEs : chap.titleEn}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.725rem',
                    color: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.35)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {lang === 'es' ? chap.descEs : chap.descEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
