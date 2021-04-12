import axios from "axios";
import mockAdapter from "axios-mock-adapter";

let mock = new mockAdapter(axios);

mock.onGet("/greetings").reply(200, () => [{ id: "1", name: "Tushar Mistry" }]);
