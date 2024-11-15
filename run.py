from app import createApp, socketio

app = createApp()

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)