import { isEmpty } from '@dimjs/lang';
import { IDraftInstance, useDraft } from '@shared/hooks/use-draft';
import { IUpdateDraftParam } from '@shared/types/common';
import { useRequest } from 'ahooks';
import { Form, FormProps } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { FC, ReactNode, useEffect } from 'react';

interface IDraftFormProps {
  /** 业务类型的编码，默认截取url作为业务类型 */
  bizType?: string;
  /** 保存的间隔，按秒计算，不传默认为3秒 */
  duration?: number;
  /** 草稿状态，用于判断是否使用草稿，默认启用 */
  disableDraft?: boolean;
  /** 业务类型的编码，默认截取url作为业务类型 */
  children?: ReactNode | ReactNode[];
  /** 排除草稿保存的字段 */
  excludeSaveFields?: string[];
}

interface IDraftFormStaticMethods {
  useDraft: () => [IDraftInstance, FormInstance];
}

let formInstance, draftInstance;

export const DraftForm: FC<IDraftFormProps & Omit<FormProps, 'form'>> & IDraftFormStaticMethods = (props) => {
  const { bizType, excludeSaveFields, duration, disableDraft = false, onValuesChange, ...rest } = props;

  const [form] = Form.useForm();
  const [draft] = useDraft(draftInstance as IDraftInstance);

  formInstance = form;
  draftInstance = draft;

  const { init, getData, save } = draft;
  const { draftId, draftData } = getData();

  useEffect(() => void initFormData(), []);

  useEffect(() => {
    if (!isEmpty(draftData)) {
      setTimeout(() => form.setFieldsValue(draftData), 1000);
    }
  }, [draftData]);

  const initFormData = async () => {
    // 编辑状态下禁用草稿
    if (disableDraft) return;
    await init({ bizType: bizType });
  };

  // 自动保存
  const { run: onAutoSave } = useRequest(
    async () => {
      if (disableDraft) return;
      const values = form.getFieldsValue();

      // 剔除字段
      excludeSaveFields?.forEach?.((exf) => {
        delete values[exf];
      });

      return save({ content: JSON.stringify(values), id: draftId } as IUpdateDraftParam);
    },
    { debounceWait: duration ? duration * 1000 : 3000, manual: true },
  );

  const onChange = (value, values) => {
    void onValuesChange?.(value, values); // 执行顶部传过来的onValuesChange方法，一般不建议顶部调用该方法
    void onAutoSave();
  };

  return (
    <Form onValuesChange={onChange} form={form} {...rest}>
      {props?.children}
    </Form>
  );
};

DraftForm.useDraft = () => [draftInstance, formInstance];
