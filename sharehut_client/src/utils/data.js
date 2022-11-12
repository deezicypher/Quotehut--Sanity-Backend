export const userQuery = (userId) => {
    const query  = `*[_type == "user" && _id == '${userId}']`;
    return query;
}
export const searchQuery = (searchTerm) => {
    const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*'] | order(_createdAt desc) {
        image{
            asset -> {
                url
            }
        },
        _id,
        about,
        quote,
        postedBy -> {
            _id,
            userName,
            image
        },
        save[]{
            _key,
            postedBy -> {
                _id,
                userName,
                image
            }
        }
    }`
    return query;
}

export const categoryQuery = (cat) => {
    const query = `*[_type == "pin" && category match '${cat}*']| order(_createdAt desc){
      image{
          asset -> {
              url
          }
      },
      _id,
      about,
      title,
      quote,
      postedBy -> {
          _id,
          userName,
          image
      },
      save[]{
          _key,
          postedBy -> {
              _id,
              userName,
              image
          }
      }
  }`
    return query;
}
export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc){
    image{
        asset -> {
            url
        }
    },
    _id,
    about,
    title,
    quote,
    postedBy -> {
        _id,
        userName,
        image
    },
    save[]{
        _key,
        postedBy -> {
            _id,
            userName,
            image
        }
    }
}`


export const pinQuery = (id) => {

    const query = `*[_type == 'pin' && _id == '${id}']{
        image{
            asset -> {
                url
            }
        },
            _id,
            title,
            about,
            category,
            quote,
        postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        _key,
        postedBy -> {
            _id,
            userName,
            image
        }
    },
    comments[]{
        _key,
        comment,
        postedBy -> {
            _id,
            userName,
            image
        }
}
    }`
    return query;
}

export const similarPin = (pin) => {
    const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
        image{
          asset->{
            url
          }
        },
        _id,
        about,
        quote,
        postedBy->{
          _id,
          userName,
          image
        },
        save[]{
          _key,
          postedBy->{
            _id,
            userName,
            image
          },
        },
      }`;
      return query;
}

export const userCreatedPinsQuery = (userId) => {
    const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
      image{
        asset->{
          url
        }
      },
      _id,
      about,
      quote,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };
export const unsavePinQ = (id,userId) => {
  const query = `*[_type == 'pin' && _id == '${id}' && '${userId}' in save[].userId]`;
  return query;

}
  export const userSavedPinsQuery = (userId) => {
    const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
      image{
        asset->{
          url
        }
      },
      _id,
      about,
      quote,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };

  