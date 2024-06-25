import React, { useEffect, useState } from 'react';

const TwitterFeed = ({ hashtag }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Manually load the Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return isClient ? (
    <div>
      <a
        className="twitter-timeline"
        data-height="800"
        data-theme="dark"
        href={`https://twitter.com/${hashtag}`}
      >
        Tweets by {hashtag}
      </a>
    </div>
  ) : null;
};

export default TwitterFeed;
