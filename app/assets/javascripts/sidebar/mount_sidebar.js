import $ from 'jquery';
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import SidebarTimeTracking from './components/time_tracking/sidebar_time_tracking.vue';
import SidebarAssignees from './components/assignees/sidebar_assignees.vue';
import ConfidentialIssueSidebar from './components/confidential/confidential_issue_sidebar.vue';
import SidebarMoveIssue from './lib/sidebar_move_issue';
import LockIssueSidebar from './components/lock/lock_issue_sidebar.vue';
import sidebarParticipants from './components/participants/sidebar_participants.vue';
import sidebarSubscriptions from './components/subscriptions/sidebar_subscriptions.vue';
import Translate from '../vue_shared/translate';
import createDefaultClient from '~/lib/graphql';
import { store } from '~/notes/stores';
import { isInIssuePage } from '~/lib/utils/common_utils';

Vue.use(Translate);
Vue.use(VueApollo);

function getSidebarOptions() {
  return JSON.parse(document.querySelector('.js-sidebar-options').innerHTML);
}

function mountAssigneesComponent(mediator) {
  const el = document.getElementById('js-vue-sidebar-assignees');
  const apolloProvider = new VueApollo({
    defaultClient: createDefaultClient(),
  });

  if (!el) return;

  const { iid, fullPath } = getSidebarOptions();
  // eslint-disable-next-line no-new
  new Vue({
    el,
    apolloProvider,
    components: {
      SidebarAssignees,
    },
    render: createElement =>
      createElement('sidebar-assignees', {
        props: {
          mediator,
          issuableIid: String(iid),
          projectPath: fullPath,
          field: el.dataset.field,
          signedIn: el.hasAttribute('data-signed-in'),
          issuableType: isInIssuePage() ? 'issue' : 'merge_request',
        },
      }),
  });
}

function mountConfidentialComponent(mediator) {
  const el = document.getElementById('js-confidential-entry-point');

  const { fullPath, iid } = getSidebarOptions();

  if (!el) return;

  const dataNode = document.getElementById('js-confidential-issue-data');
  const initialData = JSON.parse(dataNode.innerHTML);

  // eslint-disable-next-line no-new
  new Vue({
    el,
    store,
    components: {
      ConfidentialIssueSidebar,
    },
    render: createElement =>
      createElement('confidential-issue-sidebar', {
        props: {
          iid: String(iid),
          fullPath,
          isEditable: initialData.is_editable,
          service: mediator.service,
        },
      }),
  });
}

function mountLockComponent(mediator) {
  const el = document.getElementById('js-lock-entry-point');

  if (!el) return;

  const dataNode = document.getElementById('js-lock-issue-data');
  const initialData = JSON.parse(dataNode.innerHTML);

  const LockComp = Vue.extend(LockIssueSidebar);

  new LockComp({
    propsData: {
      isLocked: initialData.is_locked,
      isEditable: initialData.is_editable,
      mediator,
      issuableType: isInIssuePage() ? 'issue' : 'merge_request',
    },
  }).$mount(el);
}

function mountParticipantsComponent(mediator) {
  const el = document.querySelector('.js-sidebar-participants-entry-point');

  if (!el) return;

  // eslint-disable-next-line no-new
  new Vue({
    el,
    components: {
      sidebarParticipants,
    },
    render: createElement =>
      createElement('sidebar-participants', {
        props: {
          mediator,
        },
      }),
  });
}

function mountSubscriptionsComponent(mediator) {
  const el = document.querySelector('.js-sidebar-subscriptions-entry-point');

  if (!el) return;

  // eslint-disable-next-line no-new
  new Vue({
    el,
    components: {
      sidebarSubscriptions,
    },
    render: createElement =>
      createElement('sidebar-subscriptions', {
        props: {
          mediator,
        },
      }),
  });
}

function mountTimeTrackingComponent() {
  const el = document.getElementById('issuable-time-tracker');

  if (!el) return;

  // eslint-disable-next-line no-new
  new Vue({
    el,
    components: {
      SidebarTimeTracking,
    },
    render: createElement => createElement('sidebar-time-tracking', {}),
  });
}

export function mountSidebar(mediator) {
  mountAssigneesComponent(mediator);
  mountConfidentialComponent(mediator);
  mountLockComponent(mediator);
  mountParticipantsComponent(mediator);
  mountSubscriptionsComponent(mediator);

  new SidebarMoveIssue(
    mediator,
    $('.js-move-issue'),
    $('.js-move-issue-confirmation-button'),
  ).init();

  mountTimeTrackingComponent();
}

export { getSidebarOptions };
