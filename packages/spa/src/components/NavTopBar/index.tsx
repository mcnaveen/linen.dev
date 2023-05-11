import Header from '@linen/ui/Header';
import InternalLink from '../InternalLink';
import styles from './index.module.scss';
import { mockedComponent, mockedRouterAsPath } from '../../mock';
import { signOut } from '../SignOut';
import { useLinenStore, shallow } from '../../store';
import Loading from '../Loading';
import customUsePath from '../../hooks/usePath';
import { api } from '../../fetcher';

export default function NavTopBar() {
  const {
    channels,
    channelName,
    permissions,
    currentCommunity,
    settings,
    communityName,
  } = useLinenStore(
    (state) => ({
      channels: state.channels,
      channelName: state.channelName,
      permissions: state.permissions,
      currentCommunity: state.currentCommunity,
      settings: state.settings,
      communityName: state.communityName,
    }),
    shallow
  );

  if (!communityName || !settings || !currentCommunity || !permissions)
    return <Loading />;

  return (
    <>
      <div className={styles.push} />
      <div className={styles.header}>
        <Header
          channels={channels}
          channelName={channelName}
          signOut={signOut}
          permissions={permissions}
          settings={settings}
          currentCommunity={currentCommunity}
          // component injection
          api={api}
          Link={InternalLink({ communityName })}
          InternalLink={InternalLink({ communityName })}
          usePath={customUsePath({ communityName })}
          // TODO:
          routerAsPath={mockedRouterAsPath}
          JoinButton={mockedComponent}
          // FIXME: handle this nicely
          handleSelect={({ thread }) => {
            window.location.href = `/s/${
              currentCommunity.slackDomain || currentCommunity.discordDomain
            }/t/${thread.incrementId}/${thread.slug}`;
          }}
        />
      </div>
    </>
  );
}