declare global {
    namespace event {
        class DeleteEvent extends Event {
            constructor(id: string);
        }
    }
}