//@ts-expect-error there is types, typescript just doesnt feel like using them
import { BareClient, BareMuxConnection } from "@mercuryworkshop/bare-mux";

const connection = new BareMuxConnection("/baremux/worker.js");
export default new BareClient();

