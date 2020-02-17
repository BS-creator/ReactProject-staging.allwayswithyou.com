import { albumConstants } from '../constants';

const initialState = { isFetching: false, isFetchingAllAlbums: false, albums : [] }

export function albums(state = initialState, action) {
  switch (action.type) {
    case albumConstants.CREATE_ALBUM_REQUEST:
      return {
        isFetching: true,
        albums : state.albums,
        album : null
      };
    case albumConstants.CREATE_ALBUM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        album: action.payload,
        albums : [...state.albums, action.payload]
      };
    case albumConstants.CREATE_ALBUM_ERROR:
      return {};
    case albumConstants.GET_ALBUM_REQUEST:
      return {
        ...state,
        isFetching: true,
        album : null
      };
    case albumConstants.GET_ALBUM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        album: action.payload
        
      };
    case albumConstants.GET_ALBUM_ERROR:
      return {
        ...state,
        isFetching : false,
        album: null
      };
    case albumConstants.GET_ALL_ALBUMS_REQUEST:
      return {
        ...state,
        isFetchingAllAlbums: true,
        albums : []
      };
    case albumConstants.GET_ALL_ALBUMS_SUCCESS:
      return {
        ...state,
        isFetchingAllAlbums: false,
        albums: action.payload,
        album: null
      };
    case albumConstants.GET_ALL_ALBUMS_ERROR:
      return {
        ...state,
        isFetchingAllAlbums : false,
        albums: []
      };
    case albumConstants.UPDATE_ALBUM_REQUEST:
      return {
        ...state,
      };
    case albumConstants.UPDATE_ALBUM_SUCCESS:
      return {
        ...state,
        album: {...state.album, name: action.payload.name, description: action.payload.description}
      };
    case albumConstants.UPDATE_ALBUM_ERROR:
      return {
        ...state,
      };
    case albumConstants.ALBUM_ASSETS_UPLOAD:
      return {
        ...state,
        album: {
          ...state.album, 
          assets : state.album.assets !== null ? state.album.assets.concat(action.payload) : action.payload,
          uploaders: state.album.uploaders !== null ? state.album.uploaders.concat(action.payload[0].uploader) : action.payload[0].uploader
        }
      };
    case albumConstants.REMOVE_ASSETS_FROM_ALBUM_SUCCESS:
      return {
        ...state,
        album: {...state.album, assets : state.album.assets.filter(asset => { return  !action.payload.includes(asset.id) }) }
      };
    case albumConstants.ADD_ASSETS_TO_ALBUM_SUCCESS:
      let { assets } = state.album;
      // check if asset already exists
      action.payload.forEach(asset => {
        const index = assets.findIndex(x => x.id === asset.id);

        if (index === -1){
          assets.push(asset);
        }
      });

      return {
        ...state,
        album: {...state.album, assets }
      };
    case albumConstants.DELETE_ALBUM_SUCCESS:
      return {
        ...state,
        albums: state.albums.filter(album => album.id !== action.payload)
      };
    default:
      return state
  }
}
