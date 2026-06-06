import { Zap, Shield, Target, Award, Infinity, ZapOff, Puzzle, Search, Activity, Cpu, Bot, Wifi, PenTool, Layout, Globe, Smartphone, Brain, Play, TrendingUp } from 'lucide-react';
import React from 'react';

export interface ExpertisePoint {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const getServiceExpertise = (serviceId: string): ExpertisePoint[] => {
  const expertiseMap: Record<string, ExpertisePoint[]> = {
    'cad-design': [
      { icon: <Infinity size={24} />, title: 'Parametric Mastery', desc: 'Complex geometries handled with mathematical precision for perfect manufacturing alignment.' },
      { icon: <Puzzle size={24} />, title: 'Assembly Logic', desc: 'Expertise in multi-part assembly design, ensuring zero interference and optimal fit.' },
      { icon: <Zap size={24} />, title: 'Rapid Revisions', desc: 'Streamlined design workflows that allow for lightning-fast iterations based on feedback.' }
    ],
    'mechanical-simulation': [
      { icon: <Activity size={24} />, title: 'High-Fidelity FEA', desc: 'Deep-level Finite Element Analysis to predict stress, vibration, and thermal behavior accurately.' },
      { icon: <Target size={24} />, title: 'Failure Prevention', desc: 'Identifying potential weak points before a single physical prototype is ever built.' },
      { icon: <Zap size={24} />, title: 'CFD Optimization', desc: 'Advanced fluid dynamics to optimize airflow and cooling in high-performance systems.' }
    ],
    '3d-printing': [
      { icon: <Zap size={24} />, title: '24h Batching', desc: 'Enterprise-grade speed for rapid prototyping cycles and small-batch production runs.' },
      { icon: <Shield size={24} />, title: 'Material Science', desc: 'Deep knowledge in choosing the right polymers for strength, flexibility, or heat resistance.' },
      { icon: <Target size={24} />, title: 'Precision Tolerances', desc: 'Calibrated industrial machines ensuring dimensional accuracy within ±0.1mm.' }
    ],
    'hardware-prototyping': [
      { icon: <Cpu size={24} />, title: 'Hybrid Builds', desc: 'Seamless integration of custom electronics, mechanical parts, and embedded software.' },
      { icon: <Shield size={24} />, title: 'Reliability Testing', desc: 'Stress-testing prototypes under real-world conditions to ensure long-term durability.' },
      { icon: <Award size={24} />, title: 'DFM Ready', desc: 'Prototypes designed from day one with mass-production scalability in mind.' }
    ],
    'robotics': [
      { icon: <Bot size={24} />, title: 'Autonomous Logic', desc: 'Developing intelligent pathfinding and decision-making systems for robotic platforms.' },
      { icon: <Activity size={24} />, title: 'Sensor Fusion', desc: 'Integrating LiDAR, Vision, and IMU data for high-precision environmental awareness.' },
      { icon: <Zap size={24} />, title: 'Low-Latency Control', desc: 'High-speed PID tuning and real-time response logic for smooth motion control.' }
    ],
    'iot-services': [
      { icon: <Wifi size={24} />, title: 'Edge computing', desc: 'Processing data locally to reduce bandwidth and enable instantaneous response times.' },
      { icon: <Shield size={24} />, title: 'Protocol Security', desc: 'End-to-end encryption for all data transmissions across MQTT, LoRaWAN, and BLE.' },
      { icon: <Zap size={24} />, title: 'Ultra-Low Power', desc: 'Optimizing firmware for maximum battery life in remote sensor deployments.' }
    ],
    'product-design': [
      { icon: <PenTool size={24} />, title: 'Ergonomic Focus', desc: 'Designing products that feel natural and intuitive for human interaction.' },
      { icon: <Award size={24} />, title: 'Aesthetic Premium', desc: 'Merging high-end visual language with functional engineering for market impact.' },
      { icon: <Target size={24} />, title: 'Market Validation', desc: 'Iterating designs based on real-world user research and competitive positioning.' }
    ],
    'ui-ux-development': [
      { icon: <Layout size={24} />, title: 'Cognitive Flow', desc: 'Interfaces mapped to human psychology to reduce friction and improve task completion.' },
      { icon: <Zap size={24} />, title: 'Micro-Interactions', desc: 'Subtle motion design that provides satisfying feedback and enhances user engagement.' },
      { icon: <Shield size={24} />, title: 'Design Systems', desc: 'Building scalable, consistent UI libraries that simplify future developments.' }
    ],
    'website-development': [
      { icon: <Globe size={24} />, title: 'Core Web Vitals', desc: 'Websites optimized for perfect lighthouse scores, Ensuring maximum SEO and speed.' },
      { icon: <Zap size={24} />, title: 'Interactive WebGL', desc: 'Bespoke 3D web experiences that captivate users and differentiate your brand.' },
      { icon: <Shield size={24} />, title: 'Headless Scalability', desc: 'Modern tech stacks that handle massive traffic with zero downtime.' }
    ],
    'app-development': [
      { icon: <Smartphone size={24} />, title: 'Native Performance', desc: 'Cross-platform solutions that feel and behave like high-end native applications.' },
      { icon: <Zap size={24} />, title: 'Real-time Sync', desc: 'Offline-first architectures with instantaneous data synchronization.' },
      { icon: <Award size={24} />, title: 'App Store Success', desc: 'Optimizing everything from binary size to splash screens for successful launches.' }
    ],
    'ml-model-development': [
      { icon: <Brain size={24} />, title: 'Deep Learning', desc: 'Custom neural networks tailored for specific vision, voice, or data patterns.' },
      { icon: <Target size={24} />, title: 'Predictive Edge', desc: 'Models that anticipate trends and anomalies with industry-leading accuracy.' },
      { icon: <Shield size={24} />, title: 'Data Privacy', desc: 'Implementing AI solutions that respect strict data governance and local processing.' }
    ],
    'animation': [
      { icon: <Play size={24} />, title: 'Cinematic Visuals', desc: 'Breathtaking 3D renders that tell a compelling story about your technology.' },
      { icon: <Activity size={24} />, title: 'Technical Accuracy', desc: 'Animations that accurately represent physical mechanisms and fluid flows.' },
      { icon: <Zap size={24} />, title: 'Post-Production', desc: 'High-end color grading and sound design for a truly professional finish.' }
    ],
    'seo': [
      { icon: <TrendingUp size={24} />, title: 'Organic Dominion', desc: 'Long-term strategies that place your brand at the top of high-intent search results.' },
      { icon: <Search size={24} />, title: 'Semantic Keywordry', desc: 'Moving beyond basic tags to dominate entire topical clusters in your industry.' },
      { icon: <Target size={24} />, title: 'Conversion SEO', desc: 'Traffic optimization focused on turning visitors into high-value leads.' }
    ]
  };

  return expertiseMap[serviceId] || [
    { icon: <Zap size={24} />, title: 'Rapid Execution', desc: 'Agile development cycles ensuring your project hits the market faster.' },
    { icon: <Shield size={24} />, title: 'Quality Assurance', desc: 'Strict adherence to industry standards with multi-stage quality checks.' },
    { icon: <Target size={24} />, title: 'Strategic Growth', desc: 'Engineering solutions that provide long-term competitive advantage.' }
  ];
};
