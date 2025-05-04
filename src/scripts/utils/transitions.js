const initViewTransitions = () => {
    if (!document.startViewTransition) {
      console.warn('View Transitions API not supported in this browser');
      return;
    }
    
    window.addEventListener('hashchange', () => {
      handleViewTransition();
    });
  };
  
  const handleViewTransition = () => {
    if (!document.startViewTransition) return;
    
    try {
      document.startViewTransition(() => {
        return Promise.resolve();
      });
    } catch (error) {
      console.error('Error during view transition:', error);
    }
  };

  const applyCustomTransition = (transitionType = 'fade') => {
    if (!document.startViewTransition) return;
    
    let animationKeyframes;
    
    switch (transitionType) {
      case 'slide':
        animationKeyframes = [
          { transform: 'translateX(100%)', opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 }
        ];
        break;
      case 'zoom':
        animationKeyframes = [
          { transform: 'scale(0.8)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 }
        ];
        break;
      case 'fade':
      default:
        animationKeyframes = [
          { opacity: 0 },
          { opacity: 1 }
        ];
        break;
    }
    
    const animationOptions = {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    };
    
    try {
      document.startViewTransition(() => {
        const content = document.getElementById('app');
        content.animate(animationKeyframes, animationOptions);
        return Promise.resolve();
      });
    } catch (error) {
      console.error('Error during custom transition:', error);
    }
  };
  
  export { initViewTransitions, handleViewTransition, applyCustomTransition };