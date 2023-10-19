import React from 'react';
import { X } from '@phosphor-icons/react';

import { CWIcon } from '../cw_icons/cw_icon';
import type { IconName } from '../cw_icons/cw_icon_lookup';
import { CWText } from '../cw_text';
import { getClasses } from '../helpers';
import { ComponentType } from '../types';
import ChainInfo from '../../../../models/ChainInfo';
import { CWCommunityAvatar } from '../cw_community_avatar';

import 'components/component_kit/new_designs/CWTag.scss';

type TagType =
  | 'passed'
  | 'failed'
  | 'active' // i.e. snapshot
  | 'poll'
  | 'proposal'
  | 'referendum'
  | 'stage'
  | 'new'
  | 'spam'
  | 'trending'
  | 'disabled'
  | 'login'
  | 'input'
  | 'address';

export type TagProps = {
  iconName?: IconName;
  label: string;
  type: TagType;
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  trimAt?: number;
  classNames?: string;
  community?: ChainInfo;
};

export const CWTag = ({
  iconName,
  label,
  type,
  onClick,
  trimAt,
  classNames,
  community,
}: TagProps) => {
  const displayLabel = () => {
    if (!trimAt) {
      return label;
    }

    if (label?.length <= trimAt) {
      return label;
    }

    return label.slice(0, trimAt) + '...';
  };

  const handleClick = () => onClick();

  return (
    <div
      className={`${getClasses<{ type?: TagType }>(
        { type },
        ComponentType.Tag
      )} ${classNames || ''}`}
      onClick={onClick}
    >
      {type === 'input' && (
        <CWCommunityAvatar size="small" community={community} />
      )}
      {!!iconName && (
        <CWIcon iconName={iconName} iconSize="small" className={iconName} />
      )}
      <CWText type="caption" fontWeight="medium" noWrap>
        {displayLabel()}
      </CWText>
      {type === 'input' && (
        <div className="close-container" onClick={handleClick}>
          <X
            className={getClasses({ action: true }, ComponentType.Tag)}
            size={16}
          />
        </div>
      )}
    </div>
  );
};