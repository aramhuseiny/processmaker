export default {
  data () {
    return {
      socketListeners: []
    };
  },
  mounted () {
    console.log('MOUNTED PROCESSREQUESTCHANNEL');
    this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.instanceId}`, ".ActivityAssigned", (data) => {
      console.log('ActivityAssigned', data);
      if (data.payloadUrl) {
        this.obtainPayload(data.payloadUrl)
          .then(response => {
            this.$emit("activity-assigned", response);
          });        
      }
    });
    this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.instanceId}`, ".ProcessCompleted", (data) => {
      console.log('ProcessCompleted', data);
      if (data.payloadUrl) {
        this.obtainPayload(data.payloadUrl)
          .then(response => {
            this.$emit("process-completed", response);
          });
      }
    });
    this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.instanceId}`, ".ProcessUpdated", (data) => {
      console.log('ProcessUpdated', data);
      if (data.payloadUrl) {
        this.obtainPayload(data.payloadUrl)
          .then(response => {
            if (data.event) {
              response.event = data.event;
            }
            this.$emit("process-updated", response);
          });
      }
    });
  },
  methods: {
    addSocketListener (channel, event, callback) {
      this.socketListeners.push({
        channel,
        event
      });
      window.Echo.private(channel).listen(
        event,
        callback
      );
    },
    obtainPayload(url) {
      return new Promise((resolve, reject) => {
        ProcessMaker.apiClient
          .get(url)
          .then(response => {
            resolve(response.data);
          });
      });
    }
  },
  destroyed () {
    this.socketListeners.forEach((element) => {
      window.Echo.private(element.channel).stopListening(element.event);
    });
  }
};
