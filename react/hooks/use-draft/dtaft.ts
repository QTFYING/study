import { isEmpty } from '@dimjs/lang';
import { draftService } from '@shared/services';
import { IGetDraftListParam, IUpdateDraftParam } from '@shared/types/common';
import { isJSON } from '@shared/utils';
import { message } from 'antd';

export interface IDraftInstance {
  init: (IGetDraftListParam) => Promise<void>;
  save: (IUpdateDraftParam) => Promise<void>;
  remove: (id?: number) => void;
  getData: () => { draftId?: number; draftData?: any; draftKey?: string };
}

/**
 * 草稿箱的构造函数
 * @constructor
 */
export class DraftConstr {
  /** 草稿的id */
  private draftId: number | undefined;
  /** 草稿数据 */
  private draftData: any;
  /** 该页面的path */
  private pathname: string;
  /** 缓存标识前缀 */
  private draftStorageKey: string;
  /** 送给后台的业务key */
  private draftKey: string;

  constructor() {
    this.draftId = undefined;
    this.draftData = '';
    this.draftKey = '';
    this.pathname = window.location.pathname
      .replace(/(pages|main\/)/g, '')
      .replace(/\/{1,}/, '')
      .replace(/[\/\-]/g, '_');
    this.draftStorageKey = `${this.pathname}_draft_key`;
    this.getData = this.getData.bind(this);
  }

  // 初始化草稿数据
  public init = async (params: IGetDraftListParam) => {
    const pathname = this.pathname;

    const { bizType = pathname } = params;
    try {
      if (!bizType) {
        void message.warning('业务标识不能为空！');
        return;
      }

      const drafts = JSON.parse(sessionStorage.getItem(this.draftStorageKey) ?? '[]');
      const key = `${pathname}_type_${bizType === pathname ? 'page' : bizType}`;

      if (!drafts.includes(key)) {
        drafts.push(key);
        sessionStorage.setItem(this.draftStorageKey, JSON.stringify(drafts));
      }

      const { rows = [] } = await draftService.list({ ...params, bizType: key });

      this.draftKey = key; // 务必在接口成功后赋值
      const { content = '', id } = rows[0] ?? {};

      const info = content;
      if (info && isJSON(info)) {
        const idsMap = JSON.parse(sessionStorage.getItem(`${this.draftStorageKey}_ids`) ?? '{}');
        idsMap[this.draftKey] = id;
        sessionStorage.setItem(`${this.draftStorageKey}_ids`, JSON.stringify(idsMap));
        const data = JSON.parse(info);
        this.draftData = data;
        this.draftId = id;
        return data;
      }
    } catch (error) {
      console.error('草稿数据初始化失败，错误为：', error);
    }
  };

  // 保存草稿
  public save = async (params: IUpdateDraftParam) => {
    const { id } = params;

    try {
      const res = await draftService.save({ ...params, bizType: this.draftKey ?? this.pathname });
      if (!this.draftId) this.draftId = res.id;
      if (!id && res.id) {
        const idsMap = JSON.parse(sessionStorage.getItem(`${this.draftStorageKey}_ids`) ?? '{}');
        idsMap[this.draftKey] = res.id;
        sessionStorage.setItem(`${this.draftStorageKey}_ids`, JSON.stringify(idsMap));
      }
    } catch (error) {
      console.error('保存草稿失败，错误为：', error);
    }
  };

  // 删除草稿
  public remove = (id?: number) => {
    try {
      const idsMap: object = JSON.parse(sessionStorage.getItem(`${this.draftStorageKey}_ids`) ?? '{}');
      const ids = isEmpty(idsMap) ? [id] : Object.values(idsMap);
      void ids.map(async (item: number) => {
        await draftService.remove(item);
      });
      this.draftId = undefined;
    } catch (error) {
      console.error('草稿删除失败，错误为：', error);
    }
  };

  // 获取草稿的属性，id、data等
  public getData() {
    return { draftId: this.draftId, draftData: this.draftData, draftKey: this.draftKey };
  }
}
