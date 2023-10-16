import React, { useEffect } from 'react';

const Chatbot = () => {
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        window.botpressWebChat.init({
          botId: '0756a08e-f2a8-4b0e-a0d5-847e8f25371a',
          hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
          messagingUrl: 'https://messaging.botpress.cloud',
          clientId: '0756a08e-f2a8-4b0e-a0d5-847e8f25371a',
        });
      };
    }, []);
  
    return <div id="webchat" />;
  };
  
  export default Chatbot;
