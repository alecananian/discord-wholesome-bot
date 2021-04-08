const getRandomWholesomePost = async () => {
  const response = await fetch(
    `https://api.imgur.com/3/gallery/t/wholesome/top/week?client_id=${IMGUR_API_CLIENT_ID}&showViral=true`,
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
  const {
    data: { items }
  } = await response.json();
  return items[Math.floor(Math.random() * items.length)];
};

const convertPostToResponseData = ({
  title,
  link: url,
  description,
  images: [{ type, link: imageUrl, description: imageDescription }],
  datetime,
  account_url: authorName
}) => {
  const embedDescription = description || imageDescription;

  // Discord currently isn't showing mp4 or gifv embeds, but will expand a url in the message
  if (type === 'video/mp4') {
    return {
      content: [title, embedDescription, url].filter(Boolean).join('\n'),
    };
  }

  return {
    embeds: [
      {
        title,
        url,
        description: embedDescription,
        color: 3066993,
        timestamp: new Date(datetime * 1000).toISOString(),
        footer: {
          icon_url: 'https://s.imgur.com/images/favicon-32x32.png',
          text: 'Imgur'
        },
        image: {
          url: imageUrl
        },
        author: {
          name: authorName,
          url: `https://imgur.com/user/${authorName}`,
          icon_url: `https://imgur.com/user/${authorName}/avatar`
        }
      }
    ]
  };
};

module.exports = { getRandomWholesomePost, convertPostToResponseData };
