import * as types from './mutation_types';
import { uniqueId, cloneDeep } from 'lodash';
import { DEFAULT_ASSET_LINK_TYPE } from '../../../constants';

const findReleaseLink = (release, id) => {
  return release.assets.links.find(l => l.id === id);
};

export default {
  [types.REQUEST_RELEASE](state) {
    state.isFetchingRelease = true;
  },
  [types.RECEIVE_RELEASE_SUCCESS](state, data) {
    state.fetchError = undefined;
    state.isFetchingRelease = false;
    state.release = data;
    state.originalRelease = Object.freeze(cloneDeep(state.release));
  },
  [types.RECEIVE_RELEASE_ERROR](state, error) {
    state.fetchError = error;
    state.isFetchingRelease = false;
    state.release = undefined;
  },

  [types.UPDATE_RELEASE_TITLE](state, title) {
    state.release.name = title;
  },
  [types.UPDATE_RELEASE_NOTES](state, notes) {
    state.release.description = notes;
  },

  [types.UPDATE_RELEASE_MILESTONES](state, milestones) {
    state.release.milestones = milestones;
  },

  [types.REQUEST_UPDATE_RELEASE](state) {
    state.isUpdatingRelease = true;
  },
  [types.RECEIVE_UPDATE_RELEASE_SUCCESS](state) {
    state.updateError = undefined;
    state.isUpdatingRelease = false;
  },
  [types.RECEIVE_UPDATE_RELEASE_ERROR](state, error) {
    state.updateError = error;
    state.isUpdatingRelease = false;
  },

  [types.ADD_EMPTY_ASSET_LINK](state) {
    state.release.assets.links.push({
      id: uniqueId('new-link-'),
      url: '',
      name: '',
      linkType: DEFAULT_ASSET_LINK_TYPE,
    });
  },

  [types.UPDATE_ASSET_LINK_URL](state, { linkIdToUpdate, newUrl }) {
    const linkToUpdate = findReleaseLink(state.release, linkIdToUpdate);
    linkToUpdate.url = newUrl;
  },

  [types.UPDATE_ASSET_LINK_NAME](state, { linkIdToUpdate, newName }) {
    const linkToUpdate = findReleaseLink(state.release, linkIdToUpdate);
    linkToUpdate.name = newName;
  },

  [types.UPDATE_ASSET_LINK_TYPE](state, { linkIdToUpdate, newType }) {
    const linkToUpdate = findReleaseLink(state.release, linkIdToUpdate);
    linkToUpdate.linkType = newType;
  },

  [types.REMOVE_ASSET_LINK](state, linkIdToRemove) {
    state.release.assets.links = state.release.assets.links.filter(l => l.id !== linkIdToRemove);
  },
};
