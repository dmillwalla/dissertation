from flask import Flask, make_response, request, jsonify
from flask_cors import CORS

from franz.openrdf.sail.allegrographserver import AllegroGraphServer
from franz.openrdf.repository.repository import Repository
from franz.openrdf.connect import ag_connect
from franz.openrdf.query.query import QueryLanguage

import spacy
import textacy

from qwikidata.sparql import return_sparql_query_results

import requests

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# graph_server = AllegroGraphServer("34.78.7.88","10035","","")
# marauder_repository = graph_server.openCatalog('').getRepository('marauder-test', Repository.OPEN)
# marauder_connection = marauder_repository.getConnection()

def add_preference(preference):
    print('inside add preference')
    with ag_connect("marauder-test", create=False, host="http://34.78.7.88:10035") as marauder_con:
        print('connection successful for add preference')
        user = marauder_con.createURI("http://example.org/person/dmillwalla")
        likes = marauder_con.createURI("http://example.org/ontology/likes")
        preference_literal = marauder_con.createLiteral(preference)
        marauder_con.add(user, likes, preference_literal)
        return make_response(preference, 200)

def get_preferences():
    print('inside add preference')
    with ag_connect("marauder-test", create=False, host="http://34.78.7.88:10035") as marauder_con:
        print('connection successful for add preference')
        user = marauder_con.createURI("http://example.org/person/dmillwalla")
        likes = marauder_con.createURI("http://example.org/ontology/likes")
        response_array = []
        for each_statement in marauder_con.getStatements(user, likes, None, None):
            response_array.append(each_statement.getObject().getValue())
        return make_response(jsonify(response_array), 200)

def delete_preference(preference):
    with ag_connect("marauder-test", create=False, host="http://34.78.7.88:10035") as marauder_con:
        print('connection successful for delete preference')
        user = marauder_con.createURI("http://example.org/person/dmillwalla")
        likes = marauder_con.createURI("http://example.org/ontology/likes")
        preference_literal = marauder_con.createLiteral(preference)
        marauder_con.remove(user, likes, preference_literal)
        return make_response(preference, 200)

@app.route('/preferences', methods=['GET', 'POST', 'DELETE'])
def preference(): 
    if request.method == 'GET':
        return get_preferences()
    else:
        req_body = request.get_json()
        preference_val = req_body["preference"]
        if request.method == 'POST':
            return add_preference(preference_val)
        if request.method == 'DELETE':
            return delete_preference(preference_val)

@app.route('/addFacts', methods=['POST'])
def add_facts():
    req_body = request.get_json()
    summary = req_body["summary"]
    FIELDS = "entities,sentiment,facts"
    HOST = "nl.diffbot.com"
    TOKEN = "de58f57da4009f6f6a4b4a18de63fbb1"
    payload = {
        "content": summary,
        "lang": "en",
        "format": "plain text with title",
    }

    overleaf_str = """

    \\begin{table}[H] \n
\\caption{Samuel Beckett facts with changed sentence structure} \n
\\label{tab:} \n
\\centering \n
\\begin{tabular}{l l l l} \n
\\toprule \n
\\textbf{Subject} & \\textbf{Predicate} & \\textbf{Object} & \\textbf{Implicit/Explicit} \\\\ \n
\\midrule \n

    """

    res = requests.post("https://{}/v1/?fields={}&token={}".format(HOST, FIELDS, TOKEN), json=payload)
    ret = res.json()
    # print(ret)
    facts = ret["facts"]
    response_array = []
    for each_fact in facts:
        subject = each_fact["entity"]["name"]
        predicate = each_fact["property"]["name"]
        object = each_fact["value"]["name"]
        each_tuple = {"subject": subject, "predicate": predicate, "object": object}
        overleaf_str += "" + subject + " & " + predicate + " & " + object + " \\\\ \n"
        with ag_connect("marauder-knowledge", create=False, host="http://34.78.7.88:10035") as marauder_knowledge_con:
            print('connection successful for get recommendations')
            subject_node = marauder_knowledge_con.createLiteral(subject)
            predicate_node = marauder_knowledge_con.createURI("http://example.org/ontology/" + predicate)
            object_node = marauder_knowledge_con.createLiteral(object)
            marauder_knowledge_con.add(subject_node, predicate_node, object_node)
            response_array.append(each_tuple)
    overleaf_str += """

    \\bottomrule\\\\ \n
\\end{tabular} \n
\\end{table} \n

    """
    print(overleaf_str)
    return make_response(jsonify(response_array), 200)

@app.route('/addFactsTextacy', methods=['POST'])
def add_facts_textacy():
    req_body = request.get_json()
    summary = req_body["summary"]

    summary_text = (summary)
    # nlp = spacy.load('en_core_web_sm')
    en = textacy.load_spacy_lang("en_core_web_sm")
    text = textacy.make_spacy_doc(summary_text, lang=en)

    text_ext = textacy.extract.subject_verb_object_triples(text)
    response_array = []
    for each_text_ext in text_ext:
        print(each_text_ext)
        subject = "".join([str(i) for i in each_text_ext[0]])
        predicate = "".join([str(i) for i in each_text_ext[1]])
        object = "".join([str(i) for i in each_text_ext[2]])
        each_tuple = {"subject": subject, "predicate": predicate, "object": object}
        print(each_tuple)
        response_array.append(each_tuple)
    list_text_ext = list(text_ext)
    print(list_text_ext)
    return make_response(jsonify(response_array), 200)

@app.route('/knowledgeRecommendations', methods=['GET'])
def knowledge_recommendations():

    interests = []
    with ag_connect("marauder-test", create=False, host="http://34.78.7.88:10035") as marauder_con:
        print('connection successful for get recommendations')
        user = marauder_con.createURI("http://example.org/person/dmillwalla")
        likes = marauder_con.createURI("http://example.org/ontology/likes")
        statements = marauder_con.getStatements(user, likes, None)
        with statements:
            statements.enableDuplicateFilter()
            for statement in statements:
                interests.append(statement.getObject().getValue())

    filter_clause = "FILTER ( "
    first_interest = True

    for interest in interests:

        if not first_interest:
            filter_clause += " || "

        filter_clause += " regex(str(?o1), \"\\\\b" + interest + "\\\\b\", \"i\") "
        first_interest = False

    filter_clause += " ) ."

    reco_query = """SELECT  distinct ?s ?p WHERE
        {
            ?s ?p "Dublin" .
            ?s ?p1 ?o1 .
            """ + filter_clause + """
        }
        """

    print(reco_query)
    with ag_connect("marauder-knowledge", create=False, host="http://34.78.7.88:10035") as marauder_knowledge_con:
        tuple_query = marauder_knowledge_con.prepareTupleQuery(QueryLanguage.SPARQL, reco_query)
        knowledge_results = tuple_query.evaluate()
        response_array = []
        with knowledge_results:
            for binding_set in knowledge_results:
                    s = binding_set.getValue("s").getValue()
                    p = binding_set.getValue("p").getValue()
                    each_tuple = {"subject": s, "predicate": p}
                    response_array.append(each_tuple)
    
    return make_response(jsonify(response_array), 200)
            

@app.route('/recommendations', methods=['GET'])
def recommendations():
    interests = []
    with ag_connect("marauder-test", create=False, host="http://34.78.7.88:10035") as marauder_con:
        print('connection successful for get recommendations')
        user = marauder_con.createURI("http://example.org/person/dmillwalla")
        likes = marauder_con.createURI("http://example.org/ontology/likes")
        statements = marauder_con.getStatements(user, likes, None)
        with statements:
            statements.enableDuplicateFilter()
            for statement in statements:
                interests.append(statement.getObject().getValue())

    filter_clause = "FILTER ( "
    first_interest = True

    for interest in interests:

        if not first_interest:
            filter_clause += " || "

        filter_clause += " regex(str(?o1), \"\\\\b" + interest + "\\\\b\") "
        first_interest = False

    filter_clause += " ) ."

    sparql_query = """
        SELECT (COUNT(?item) AS ?count)
        WHERE {
                ?item wdt:P31/wdt:P279* wd:Q5 .
        }
    """


    reco_query = """

        SELECT DISTINCT ?sLabel ?s2Label
        WHERE 
        {
            ?s ?p wd:Q1761 .
            ?s ?p1 ?o1 .
            ?s2 ?pl ?p .
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
            FILTER ( ?pl NOT IN (owl:onProperty) )
            """ + filter_clause + """
        }

        LIMIT 100

    """

    print(reco_query)
    sparql_result = return_sparql_query_results(reco_query)
    print(sparql_result['head'])
    heads = sparql_result['head']['vars']
    reco_results_bindings = sparql_result['results']['bindings']
    response_array = []
    for each_binding in reco_results_bindings:
        each_reco = {}
        for each_head in heads:
            each_reco[each_head] = each_binding[each_head]["value"]
        response_array.append(each_reco)
    # print(sparql_result)
    return make_response(jsonify(response_array), 200)
    


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)