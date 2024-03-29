import { CacheNamespaces, cache, logger } from '@hicommonwealth/core';
import type { DB } from '@hicommonwealth/model';
import { AddressAttributes } from '@hicommonwealth/model';
import { v4 as uuidv4 } from 'uuid';
import {
  ActivityRow,
  getActivityFeed,
  type GlobalActivity,
} from './activityQuery';

type GlobalActivityJson = Array<
  Omit<ActivityRow, 'commenters'> & {
    commenters: Array<{ id: number; Addresses: AddressAttributes[] }>;
  }
>;

const log = logger().getLogger(__filename);

export default class GlobalActivityCache {
  private _cacheKey = 'global_activity';
  private _lockName = 'global_activity_cache_locker';
  private _initialized = false;

  constructor(
    private _models: DB,
    private _cacheTTL: number = 60 * 5, // cache TTL in seconds
  ) {}

  public async start() {
    await this.refreshGlobalActivity();
    this._initialized = true;
    setInterval(this.refreshGlobalActivity.bind(this), this._cacheTTL * 1000);
  }

  public async getGlobalActivity(): Promise<
    GlobalActivityJson | GlobalActivity
  > {
    const activity = await cache().getKey(
      CacheNamespaces.Activity_Cache,
      this._cacheKey,
    );

    if (!activity) {
      if (this._initialized) {
        const msg = 'Failed to fetch global activity from Redis';
        log.error(msg);
      }
      return await getActivityFeed(this._models);
    }
    return JSON.parse(activity);
  }

  public async deleteActivityFromCache(
    threadId: number,
    commentId?: number,
  ): Promise<void> {
    const errorMsg = 'Failed to update global activity in Redis';

    try {
      const res = await cache().getKey(
        CacheNamespaces.Activity_Cache,
        this._cacheKey,
      );

      if (!res) {
        log.info('Global Activity Cache is empty');
        return;
      }

      let activity = JSON.parse(res);
      let updated = false;
      activity = activity.filter((a: GlobalActivityJson[number]) => {
        let shouldKeep: boolean;
        if (commentId) {
          const notifData = JSON.parse(a.notification_data);
          shouldKeep =
            a.thread_id !== threadId && notifData.commentId !== commentId;
        } else {
          shouldKeep = a.thread_id !== threadId;
        }

        if (!shouldKeep) updated = true;
        return shouldKeep;
      });

      if (!updated) return;

      const result = await cache().setKey(
        CacheNamespaces.Activity_Cache,
        this._cacheKey,
        JSON.stringify(activity),
      );
      if (!result) {
        log.error(errorMsg);
      }
    } catch (e) {
      log.error(errorMsg, e);
    }
  }

  private async refreshGlobalActivity(): Promise<void> {
    try {
      const lockAcquired = await this.acquireLock();

      if (lockAcquired === false) {
        log.info('Unable to acquire lock. Skipping refresh...');
        return;
      }

      const activity = await getActivityFeed(this._models);
      const result = await cache().setKey(
        CacheNamespaces.Activity_Cache,
        this._cacheKey,
        JSON.stringify(activity),
      );

      if (!result) {
        const msg = 'Failed to save global activity in Redis';
        log.error(msg);
        return;
      }

      log.info('Activity cache successfully refreshed');
    } catch (e) {
      const msg = 'Failed to refresh the global cache';
      log.error(msg, e);
    }
  }

  private async acquireLock() {
    return await cache().setKey(
      CacheNamespaces.Activity_Cache,
      this._lockName,
      uuidv4(),
      // shorten by 5 seconds to eliminate any discrepancies
      // between setInterval delay and Redis TTL
      this._cacheTTL - 5,
      true,
    );
  }
}
