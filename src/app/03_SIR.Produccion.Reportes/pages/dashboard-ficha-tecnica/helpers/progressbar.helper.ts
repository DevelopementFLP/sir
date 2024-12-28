const progressBarAnimation = `        
    .ficha__detalles::before {
        content: "";
        position: absolute;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        top: 0;
        left: 0;
        min-height: 5px;  
        width: 0%;
        background-color: #003566;
        animation: trazo-borde-superior @animationDuration linear infinite;
    }
        
        @keyframes trazo-borde-superior {
            0% {
                width: 0%;
            }
            99% {
                width: 100%;
                }
            100% {
            width: 0%;
            }
        }

        @media (max-width: @minWidht) {
            .ficha__detalles::before {
                content: none;
            } 
        }
    
      `;

export function setProgressBarAnimation(
  duration: number,
  minWidth: number
) {
    let styleTag = document.querySelector('style');
    if(!styleTag) {
        styleTag = document.createElement('style');
        document.head.appendChild(styleTag);
    }

    const finalStyle = progressBarAnimation.replace('@animationDuration', `${duration / 1000}s`).replace('@minWidht', `${minWidth}px`);

    styleTag.innerHTML += finalStyle;
}
