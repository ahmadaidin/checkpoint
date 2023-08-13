

import type {Checkpoint} from "$lib/entity/checkpoint";
import type { WriteResponse } from "$lib/entity/message";

declare global {
    namespace repository {
        interface ICheckpointRepository {
            create: (checkpoint: Checkpoint) => Promise<Checkpoint>;
            get: (checkpointId: string) => Promise<Checkpoint>;
            list: () => Promise<Array[Checkpoint]>;
            update: (checkpoint: Checkpoint) => Promise<any>;
            delete: (checkpointId: string) => Promise<any>;
        }
    }
}