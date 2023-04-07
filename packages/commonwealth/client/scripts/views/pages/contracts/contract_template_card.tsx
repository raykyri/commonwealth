import React from 'react';

import app from 'state';
import { CWCard } from 'views/components/component_kit/cw_card';
import { CWText } from 'views/components/component_kit/cw_text';
import { CWIconButton } from 'views/components/component_kit/cw_icon_button';
import { PopoverMenu } from 'views/components/component_kit/cw_popover/cw_popover_menu';
import {
  displayOptions,
  ManageContractTemplateModalProps,
} from 'views/modals/manage_contract_template_modal';

import 'pages/contracts/contract_template_card.scss';
import { openConfirmation } from 'views/modals/confirmation_modal';

type ContractTemplateCardProps = {
  contractId: number;
  id: number;
  title: string;
  displayName: string;
  nickname: string;
  slug: string;
  display: string;
  cctmd_id: number;
  handleShowModal: (
    templateId: number,
    template: Omit<ManageContractTemplateModalProps['template'], 'id' | 'title'>
  ) => void;
};

interface InfoOrder {
  key: keyof ContractTemplateCardProps;
  label: string;
}

const infosOrder: InfoOrder[] = [
  { key: 'displayName', label: 'Display Name' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'slug', label: 'Slug' },
  { key: 'display', label: 'Display' },
];

const parseDisplayOption = (displayOption: string) => {
  return displayOptions.find((option) => option.value === displayOption)?.label;
};

export const ContractTemplateCard = ({
  title,
  contractId,
  cctmd_id,
  id: templateId,
  handleShowModal,
  ...templateInfo
}: ContractTemplateCardProps) => {
  const handleEditTemplate = async () => {
    handleShowModal(contractId, templateInfo);
  };

  const handleDeleteTemplate = () => {
    openConfirmation({
      title: 'Delete Template',
      description: (
        <>
          Deleting this template <b>{templateInfo.displayName}</b> is permanent
          and deletes all associated data. Are you sure you want to proceed?
        </>
      ),
      buttons: [
        {
          label: 'Delete',
          buttonType: 'mini-red',
          onClick: async () => {
            await app.contracts.deleteCommunityContractTemplate({
              contract_id: contractId,
              template_id: templateId,
              cctmd_id,
            });
          },
        },
        {
          label: 'Cancel',
          buttonType: 'mini-black',
        },
      ],
    });
  };

  return (
    <CWCard fullWidth className="ContractTemplateCard">
      <div className="header">
        <CWText type="h5" className="title">
          {title}
        </CWText>
        <PopoverMenu
          renderTrigger={(onclick) => (
            <CWIconButton iconName="dotsVertical" onClick={onclick} />
          )}
          menuItems={[
            {
              label: 'Edit Template',
              iconLeft: 'write',
              onClick: handleEditTemplate,
            },
            {
              label: 'Delete',
              iconLeft: 'trash',
              onClick: handleDeleteTemplate,
            },
          ]}
        />
      </div>
      <div className="contract-info-container">
        {infosOrder.map((info) => {
          if (!templateInfo[info.key]) {
            return null;
          }

          return (
            <div className="info-row" key={info.label}>
              <CWText type="b2" className="row-label">
                {info.label}
              </CWText>
              <CWText type="b2" className="row-value">
                {info.key === 'display'
                  ? parseDisplayOption(templateInfo.display)
                  : templateInfo[info.key]}
              </CWText>
            </div>
          );
        })}
      </div>
    </CWCard>
  );
};
