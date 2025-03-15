import { Agenda } from "@hokify/agenda";

const connectionOpts = {
  db: { address: process.env.MONGO_URL as string, collection: "agendaJobs" },
};

const agenda: Agenda = new Agenda(connectionOpts);

const jobTypes: string[] = process.env.JOB_TYPES
  ? process.env.JOB_TYPES.split(",")
  : [];

jobTypes.forEach((type) =>
  import(`../jobs/${type}`).then((job) => job[type](agenda))
);

if (jobTypes.length) {
  agenda.start();
}

export default agenda;
