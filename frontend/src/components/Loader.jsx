import React from 'react';

const Loader = () => {
  // CSS variables as JS variables for easier manipulation
  const size = 32; // px
  const duration = '800ms';
  
  return (
    <div className="flex justify-center items-center h-screen w-screen ">
      <div 
        className="boxes relative"
        style={{
          height: `${size * 2}px`,
          width: `${size * 3}px`,
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          marginTop: `${size * 1.5 * -1}px`,
          transform: 'rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px)'
        }}
      >
        {[1, 2, 3, 4].map((boxNum) => (
          <div 
            key={boxNum}
            className="box absolute top-0 left-0"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: boxNum === 1 ? 'translate(100%, 0)' :
                        boxNum === 2 ? 'translate(0, 100%)' :
                        boxNum === 3 ? 'translate(100%, 100%)' :
                        'translate(200%, 0)',
              animation: `${boxNum === 1 ? 'box1' : 
                          boxNum === 2 ? 'box2' : 
                          boxNum === 3 ? 'box3' : 'box4'} ${duration} linear infinite`
            }}
          >
            {[1, 2, 3, 4].map((faceNum) => (
              <div
                key={faceNum}
                className="absolute w-full h-full"
                style={{
                  background: faceNum === 1 ? '#5C8DF6' : 
                             faceNum === 2 ? '#145af2' : 
                             faceNum === 3 ? '#447cf5' : '#DBE3F4',
                  top: faceNum === 1 || faceNum === 4 ? '0' : 'auto',
                  left: faceNum === 1 || faceNum === 4 ? '0' : 'auto',
                  right: faceNum === 2 ? '0' : 'auto',
                  bottom: 'auto',
                  transform: `rotateY(${faceNum === 2 ? '90deg' : '0deg'}) 
                             rotateX(${faceNum === 3 ? '-90deg' : '0deg'}) 
                             translateZ(${faceNum === 4 ? `${size * 3 * -1}px` : `${size / 2}px`})`
                }}
              />
            ))}
          </div>
        ))}
        
        {/* CSS Animations */}
        <style>{`
          @keyframes box1 {
            0%, 50% { transform: translate(100%, 0); }
            100% { transform: translate(200%, 0); }
          }
          @keyframes box2 {
            0% { transform: translate(0, 100%); }
            50% { transform: translate(0, 0); }
            100% { transform: translate(100%, 0); }
          }
          @keyframes box3 {
            0%, 50% { transform: translate(100%, 100%); }
            100% { transform: translate(0, 100%); }
          }
          @keyframes box4 {
            0% { transform: translate(200%, 0); }
            50% { transform: translate(200%, 100%); }
            100% { transform: translate(100%, 100%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;