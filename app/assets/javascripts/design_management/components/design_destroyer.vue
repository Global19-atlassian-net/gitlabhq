<script>
import { ApolloMutation } from 'vue-apollo';
import getDesignListQuery from '../graphql/queries/get_design_list.query.graphql';
import destroyDesignMutation from '../graphql/mutations/destroy_design.mutation.graphql';
import { updateStoreAfterDesignsDelete } from '../utils/cache_update';

export default {
  components: {
    ApolloMutation,
  },
  props: {
    filenames: {
      type: Array,
      required: true,
    },
  },
  inject: {
    projectPath: {
      default: '',
    },
    iid: {
      from: 'issueIid',
      defaut: '',
    },
  },
  computed: {
    projectQueryBody() {
      return {
        query: getDesignListQuery,
        variables: { fullPath: this.projectPath, iid: this.iid, atVersion: null },
      };
    },
  },
  methods: {
    updateStoreAfterDelete(
      store,
      {
        data: { designManagementDelete },
      },
    ) {
      updateStoreAfterDesignsDelete(
        store,
        designManagementDelete,
        this.projectQueryBody,
        this.filenames,
      );
    },
  },
  destroyDesignMutation,
};
</script>

<template>
  <apollo-mutation
    #default="{ mutate, loading, error }"
    :mutation="$options.destroyDesignMutation"
    :variables="{
      filenames,
      projectPath,
      iid,
    }"
    :update="updateStoreAfterDelete"
    v-on="$listeners"
  >
    <slot v-bind="{ mutate, loading, error }"></slot>
  </apollo-mutation>
</template>
