from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import pickle
import json
import random
import tensorflow
import tflearn
import numpy
import nltk
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()
from tensorflow.python.framework import ops

with open("intents.json") as file:
    data = json.load(file)
    
try:
    with open("data.pickle", "rb") as f:
        words, labels, training, output = pickle.load(f)
except:
    words = []
    labels = []
    docs_x = []
    docs_y = []

    for intent in data["intents"]:
        for pattern in intent["patterns"]:
            wrds = nltk.word_tokenize(pattern)
            words.extend(wrds)
            docs_x.append(wrds)
            docs_y.append(intent["tag"])

        if intent["tag"] not in labels:
            labels.append(intent["tag"])

    words = [stemmer.stem(w.lower()) for w in words if w != "?"]
    words = sorted(list(set(words)))

    labels = sorted(labels)

    training = []
    output = []

    out_empty = [0 for _ in range(len(labels))]

    for x, doc in enumerate(docs_x):
        bag = []

        wrds = [stemmer.stem(w.lower()) for w in doc]

        for w in words:
            if w in wrds:
                bag.append(1)
            else:
                bag.append(0)

        output_row = out_empty[:]
        output_row[labels.index(docs_y[x])] = 1

        training.append(bag)
        output.append(output_row)

    training = numpy.array(training)
    output = numpy.array(output)

    with open("data.pickle", "wb") as f:
        pickle.dump((words, labels, training, output), f)


ops.reset_default_graph()
net = tflearn.input_data(shape=[None, len(training[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)

def loadModel():
    try:
        f = open("model.tflearn.index")
        model.load("model.tflearn")
    except IOError:
        model.fit(training, output, n_epoch=1000, batch_size=8, show_metric=True)
        model.save("model.tflearn")

loadModel()

def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1

    return numpy.array(bag)

def Bot(response):
    results = model.predict([bag_of_words(response["msg"], words)])
    results_index = numpy.argmax(results)
    tag = labels[results_index]
    response['reply'] = "Lo siento no te he entendido bien, ¿Puedes repetirlo?."
    response['prob'] = str(results[0][results_index])

    if results[0][results_index] > 0.75:
        for tg in data["intents"]:
            if tg['tag'] == tag:
                responses = tg['responses']

        response['reply'] = random.choice(responses)
        return response
    else:
        return response

hostName = "localhost"
serverPort = 8080
#SERVER
class BotAPI(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length) 
 
        json_string = json.loads(post_data.decode('utf-8'))
        response = json.dumps(Bot(json_string)).encode('utf-8')
        self._set_response()
        self.wfile.write(response)

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), BotAPI)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")


