import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { Navigate } from 'navigation/helpers';
import app from 'state';
import { withLayout } from 'views/layout';

const WhyCommonwealthPage = lazy(() => import('views/pages/why_commonwealth'));
const DashboardPage = lazy(() => import('views/pages/user_dashboard'));
const CommunitiesPage = lazy(() => import('views/pages/communities'));
const SearchPage = lazy(() => import('views/pages/search'));
const Web3LoginPage = lazy(() => import('views/pages/web3login'));

const OverviewPage = lazy(() => import('views/pages/overview'));
const MembersPage = lazy(() => import('views/pages/members'));
const ChatPage = lazy(() => import('views/pages/chat'));
const SputnikDaosPage = lazy(() => import('views/pages/sputnikdaos'));
const FinishNearLoginPage = lazy(() => import('views/pages/finish_near_login'));
const FinishAxieLoginPage = lazy(() => import('views/pages/finish_axie_login'));

const NotificationsPage = lazy(() => import('views/pages/notifications'));
const NotificationSettingsPage = lazy(
  () => import('views/pages/notification_settings')
);

const ReferendaPage = lazy(() => import('views/pages/referenda'));
const ProposalsPage = lazy(() => import('views/pages/proposals'));
const ViewProposalPage = lazy(() => import('views/pages/view_proposal/index'));
const NewProposalPage = lazy(() => import('views/pages/new_proposal/index'));

const DiscussionsPage = lazy(() => import('views/pages/discussions'));
const ViewThreadPage = lazy(() => import('views/pages/view_thread/index'));
const NewThreadPage = lazy(() => import('views/pages/new_thread'));
const DiscussionsRedirectPage = lazy(
  () => import('views/pages/discussions_redirect')
);
const FeedPage = lazy(() => import('views/pages/feed'));

const NewContractPage = lazy(() => import('views/pages/new_contract'));
const GeneralContractPage = lazy(() => import('views/pages/general_contract'));

const SettingsPage = lazy(() => import('views/pages/settings'));

const TreasuryPage = lazy(() => import('views/pages/treasury'));
const TipsPage = lazy(() => import('views/pages/tips'));

const ManageCommunityPage = lazy(
  () => import('views/pages/manage_community/index')
);
const AnalyticsPage = lazy(() => import('views/pages/stats'));
const SnapshotProposalPage = lazy(
  () => import('views/pages/snapshot_proposals')
);
const ViewMultipleSnapshotsPage = lazy(
  () => import('views/pages/view_multiple_snapshot_spaces')
);
const ViewSnapshotsProposalPage = lazy(
  () => import('views/pages/view_snapshot_proposal')
);
const NewSnapshotProposalPage = lazy(
  () => import('views/pages/new_snapshot_proposal')
);

const ProfilePage = lazy(() => import('views/pages/profile'));

const getCommonDomainsRoutes = () => (
  <>
    <Route
      path="/whyCommonwealth"
      element={withLayout(WhyCommonwealthPage, { hideSidebar: true })}
    />
    <Route
      path="/dashboard"
      element={withLayout(DashboardPage, {
        deferChain: true,
      })}
    />
    <Route
      path="/dashboard/:type"
      element={withLayout(DashboardPage, {
        deferChain: true,
      })}
    />
    <Route
      path="/communities"
      element={withLayout(CommunitiesPage, {
        hideSidebar: false,
      })}
    />
    <Route
      path="/search"
      element={withLayout(SearchPage, {
        deferChain: true,
      })}
    />
    <Route
      path="/web3login"
      element={withLayout(Web3LoginPage, {
        deferChain: true,
      })}
    />
    {/*scoped */}
    <Route
      path="/:scope/overview"
      element={withLayout(OverviewPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/search"
      element={withLayout(SearchPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/members"
      element={withLayout(MembersPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/chat/:channel"
      element={withLayout(ChatPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/sputnik-daos"
      element={withLayout(SputnikDaosPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/finishNearLogin"
      element={withLayout(FinishNearLoginPage, {
        scoped: true,
      })}
    />
    <Route
      path="/finishaxielogin"
      element={withLayout(FinishAxieLoginPage, {})}
    />
    {/* NOTIFICATIONS */}
    <Route
      path="/:scope/notifications"
      element={withLayout(NotificationsPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/notification-settings"
      element={withLayout(NotificationSettingsPage, {
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/notification-settings"
      element={<Navigate to="/notification-settings" />}
    />
    <Route
      path="/notifications"
      element={<Navigate to={'/edgeware/notifications'} />}
    />
    {/* NOTIFICATIONS END*/}

    {/* GOVERNANCE */}
    <Route
      path="/:scope/referenda"
      element={withLayout(ReferendaPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/proposals"
      element={withLayout(ProposalsPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/proposal/:type/:identifier"
      element={withLayout(ViewProposalPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/proposal/:identifier"
      element={withLayout(ViewProposalPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/new/proposal/:type"
      element={withLayout(NewProposalPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/new/proposal"
      element={withLayout(NewProposalPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/proposal/discussion/:identifier"
      element={
        <Navigate to={(parameters) => `/discussion/${parameters.identifier}`} />
      }
    />
    {/* GOVERNANCE END*/}

    {/* DISCUSSIONS */}
    <Route
      path="/:scope/discussions"
      element={withLayout(DiscussionsPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/discussions/:topic"
      element={withLayout(DiscussionsPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/discussion/:identifier"
      element={withLayout(ViewThreadPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/new/discussion"
      element={withLayout(NewThreadPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/proposal/discussion/:identifier"
      element={
        <Navigate
          to={(parameters) =>
            `/${parameters.scope}/discussion/${parameters.identifier}`
          }
        />
      }
    />
    <Route
      path="/:scope"
      element={withLayout(DiscussionsRedirectPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/feed"
      element={withLayout(FeedPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    {/* DISCUSSIONS END*/}

    {/* CONTRACTS */}
    <Route
      path="/:scope/new/contract"
      element={withLayout(NewContractPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/contract/:contractAddress"
      element={withLayout(GeneralContractPage, {
        scoped: true,
      })}
    />
    {/* CONTRACTS END*/}

    {/* SETTINGS */}
    <Route
      path="/:scope/settings"
      element={withLayout(SettingsPage, {
        scoped: true,
      })}
    />
    <Route path="/settings" element={<Navigate to="/edgeware/settings" />} />
    {/* SETTINGS END*/}

    {/* TREASURY */}
    <Route
      path="/:scope/treasury"
      element={withLayout(TreasuryPage, {
        scoped: true,
      })}
    />
    <Route
      path="/:scope/tips"
      element={withLayout(TipsPage, {
        scoped: true,
      })}
    />
    {/* TREASURY END*/}
    {/* ADMIN */}
    <Route
      path="/:scope/manage"
      element={withLayout(ManageCommunityPage, {
        scoped: true,
      })}
    />
    <Route path="/manage" element={withLayout(ManageCommunityPage, {})} />
    <Route
      path="/:scope/analytics"
      element={withLayout(AnalyticsPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/snapshot/:snapshotId"
      element={withLayout(SnapshotProposalPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/multiple-snapshots"
      element={withLayout(ViewMultipleSnapshotsPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/snapshot/:snapshotId/:identifier"
      element={withLayout(ViewSnapshotsProposalPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/new/snapshot/:snapshotId"
      element={withLayout(NewSnapshotProposalPage, {
        scoped: true,
        deferChain: true,
      })}
    />
    {/*// snapshot proposals redirects */}
    <Route
      path="/:scope/snapshot-proposals/:snapshotId"
      element={
        // redirect to SnapshotProposalPage
        <Navigate
          to={(parameters) =>
            `/${parameters.scope}/snapshot/${parameters.snapshotId}`
          }
        />
      }
    />
    <Route
      path="/:scope/snapshot-proposal/:snapshotId/:identifier"
      element={
        // redirect to ViewSnapshotsProposalPage
        <Navigate
          to={(parameters) =>
            `/${parameters.scope}/snapshot/${parameters.snapshotId}/${parameters.identifier}`
          }
        />
      }
    />
    <Route
      path="/:scope/snapshot-proposals/:snapshotId/:identifier"
      element={
        // redirect to ViewSnapshotsProposalPage
        <Navigate
          to={(parameters) =>
            `/${parameters.scope}/snapshot/${parameters.snapshotId}/${parameters.identifier}`
          }
        />
      }
    />
    <Route
      path="/:scope/new/snapshot-proposal/:snapshotId"
      element={
        // redirect to NewSnapshotProposalPage
        <Navigate
          to={(parameters) =>
            `/${parameters.scope}/new/snapshot/${parameters.snapshotId}`
          }
        />
      }
    />
    <Route
      path="/:scope/new/snapshot-proposals/:snapshotId"
      element={
        // redirect to NewSnapshotProposalPage
        <Navigate
          to={(parameters) =>
            `/${parameters.scope}/new/snapshot/${parameters.snapshotId}`
          }
        />
      }
    />
    {/* ADMIN END*/}
    {/* PROFILES*/}
    <Route
      path="/:scope/account/:address"
      element={withLayout(ProfilePage, {
        scoped: true,
        deferChain: true,
      })}
    />
    <Route
      path="/:scope/account"
      element={
        <Navigate
          to={({ scope }) =>
            app.user.activeAccount
              ? `/${scope}/account/${app.user.activeAccount.address}`
              : `/${scope}`
          }
        />
      }
    />
    {/* PROFILES END*/}
    {/*  LEGACY REDIRECTS */}
    {/*//here for compatibility only*/}
    <Route path="/discussions" element={<Navigate to="/" />} />
    <Route path="/home" element={<Navigate to="/" />} />
    <Route
      path="/:scope/home"
      element={<Navigate to={(parameters) => `/${parameters.scope}/`} />}
    />
    {/*  LEGACY REDIRECTS END */}
  </>
);

export default getCommonDomainsRoutes;