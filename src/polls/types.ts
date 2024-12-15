export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollFields = {
  pollID: string;
  userID: string;
  name: string;
};

// repository types
export type Participants = {
  [participantID: string]: string;
};

export type CreatePollData = {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  adminID: string;
  participants: Participants;
  hasStarted: boolean;
};
