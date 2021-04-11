const getImgurPosts = async path => {
  const response = await fetch(
    `https://api.imgur.com/3${path}?client_id=${IMGUR_API_CLIENT_ID}&showViral=true`,
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
  const {
    data: { items }
  } = await response.json();
  return items.filter(({ is_ad: isAd }) => !isAd);
};

const getRandomWholesomePost = async () => {
  const items = await getImgurPosts('/gallery/t/wholesome/top/week');
  return items[Math.floor(Math.random() * items.length)];
};

const getTopWholesomePost = async () => {
  const items = await getImgurPosts('/gallery/t/wholesome/top/day');
  for (const item of items) {
    if (await USED_IMGUR_IDS.get(item.id)) {
      continue;
    }

    await USED_IMGUR_IDS.put(item.id, '1', { expirationTtl: 86400 });
    return item;
  }

  return items[0];
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

  // Discord currently isn't showing mp4 or gif embeds, but will expand a url in the message
  if (type === 'video/mp4' || type === 'image/gif') {
    return {
      content: [title, embedDescription, url].filter(Boolean).join('\n')
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

module.exports = {
  getRandomWholesomePost,
  getTopWholesomePost,
  convertPostToResponseData
};
