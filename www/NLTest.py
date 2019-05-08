import io
import os

# Imports the Google Cloud client library

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types

#client = language.Client()
#document = client.document_from_text(text)
#sent_analysis = document.analyze_sentiment()
#print(dir(sent_analysis))
#sentiment = sent_analysis.sentiment

# Instantiates a client
client = language.LanguageServiceClient()
text = 'Incentive salience, a motivational "wanting" attribute given by the brain Mortality salience, attention toward a particular object'

# The text to analyze
#text = u'Hello, world!'
document = types.Document(
    content=text,
    type=enums.Document.Type.PLAIN_TEXT)

# Detects the sentiment of the text
sentiment = client.analyze_sentiment(document=document).document_sentiment


response = client.analyze_entities(
    document=document,
    encoding_type='UTF32',
)
for entity in response.entities:
    print('         name: {0}'.format(entity.name))
    print('         type: {0}'.format(entity.type))
    print('     metadata: {0}'.format(entity.metadata))
    print('     salience: {0}'.format(entity.salience))

print('Text: {}'.format(text))
print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))
