import { JSONCodec } from "nats";
import { KV, KvOptions } from "nats/lib/nats-base-client/types";
import { NatsService } from "./NatsService";

const DEFAULT_OPTIONS: Partial<KvOptions> = {
  ttl: 60 * 1000,
  history: 1,
};

/**
 * Nats KV Service
 * 
 * NOTICE, to use this feature, MUST [enable the jetstream feature](https://docs.nats.io/nats-concepts/jetstream/js_walkthrough#prerequisite-enabling-jetstream) on nats server firstly
 */
class NatsKVService extends NatsService {

  protected kv!: KV;

  protected codec = JSONCodec();

  async init(): Promise<any> {
    await super.init();
    this.kv = await this.nc.jetstream().views.kv(
      this.options.kv ?? "default",
      Object.assign(
        {},
        DEFAULT_OPTIONS,
        this.options?.options ?? {}
      )
    );
  }

  async set(k: string, v: any) {
    return this.kv.put(k, this.codec.encode(v), {});
  }

  async get(k: string) {
    return this.kv.get(k);
  }

  async keys() {
    return this.kv.keys();
  }

  async remove(k: string) {
    return this.kv.purge(k);
  }


}

export = NatsKVService