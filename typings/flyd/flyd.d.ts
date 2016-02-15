declare namespace __Flyd {

    interface Stream {
    }
    
    interface StreamFunc {
        (...args: any[]): Stream;
    }

    var stream: (...args: any[]) => Stream;
    var scan: (fn: Function, acc: any, stream: Stream) => Stream;
    var map: (fn: Function, stream: Stream) => Stream;
    var on: (fn: Function, stream: Stream) => void;
}

declare module "flyd" {
	export = __Flyd    
}
