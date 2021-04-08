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
  images: [{ type, link: imageUrl }],
  datetime,
  account_url: authorName
}) => {
  // Discord currently isn't showing mp4 or gifv embeds, but will expand a url in the message
  if (type === 'video/mp4') {
    return {
      content: `${title}\n${url}`
    };
  }

  return {
    embeds: [
      {
        title,
        url,
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
