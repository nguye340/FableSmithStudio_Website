import React from 'react';
import { FaSoundcloud, FaClipboard } from 'react-icons/fa';
import { SiUnrealengine, SiAutodesk, SiSubstack, SiBlender } from 'react-icons/si';
import './ToolsSection.css';

const ToolsSection = () => {
  const tools = [
    { 
      name: 'Unreal Engine 5', 
      icon: <SiUnrealengine className="tool-icon" />,
      description: 'Powering our stunning visuals and immersive gameplay'
    },
    { 
      name: 'Blender', 
      icon: <SiBlender className="tool-icon" />,
      description: 'For 3D modeling and asset creation'
    },
    { 
      name: 'Maya', 
      icon: <SiAutodesk className="tool-icon" />,
      description: 'Advanced 3D modeling and animation'
    },
    { 
      name: 'Substance Painter', 
      icon: <SiSubstack className="tool-icon" />,
      description: 'High-quality texturing and material creation'
    },
    { 
      name: 'Clip Studio Paint', 
      icon: <FaClipboard className="tool-icon" />,
      description: '2D art and concept development'
    },
    { 
      name: 'FreeSound', 
      icon: <FaSoundcloud className="tool-icon" />,
      description: 'Royalty-free sound effects and music'
    },
  ];

  return (
    <section className="tools-section">
      <div className="section-header">
        <h2 className="section-title">Engine & Tools</h2>
        <p className="section-subtitle" style={{paddingTop: '1rem'}}>
          Built with industry-standard technology to deliver a seamless gaming experience with stunning visuals and immersive audio.
        </p>
      </div>
      
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div key={index} className="tool-card">
            <div className="tool-icon-container">
              {tool.icon}
            </div>
            <div className="tool-info">
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsSection;
