const Conversation = require('../Models/Conversation');
const chatHistoryHandler = async (socket, data) => {
  try {
    // conversation Id which we are getting from the client side
    const { conversationId } = data;
    console.log(data, 'conversation Id from messsageHistory');
    if (!conversationId) {
      return socket.emit('error', { message: 'conversationId is null or undefined' });
    }
    // find conversation by Id and populate all messages
    const conversation = await Conversation.findById(conversationId)
      .select('messages')
      .populate('messages');
    if (!conversation) {
      return socket.emit('error', { message: 'conversation not found' });
    }
    // Prepare the response data
    const res_data = {
      conversationId,
      history: conversation.messages,
    };
    // emit chat history to the same socket
    socket.emit('chat-history', res_data);
  } catch (error) {
    // handle any errors and send error event back
    socket.emit('error', { message: 'Failed to fetch chat history', error });
  }
};
module.exports = chatHistoryHandler;
