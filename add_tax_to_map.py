import csv, json
f = open('credits.csv', 'r')
reader = csv.reader(f)
credits = [property for property in reader]

f = open('names_converted.json', 'r')
cities_conv = dict((v.encode('utf8'),k) for k, v in json.load(f).items())
credits_conv = dict([(cities_conv[i[0]], dict(zip([2008, 2009, 2010, 2011, 2012], i[1:]))) for i in credits if cities_conv.get(i[0])])

f = open('ua_topo.json', 'r')
geo = json.load(f)
cr2012 = []
for i in geo['objects']['states']['geometries']:
    cr = credits_conv.get(i['properties']['oblname'])
    if cr:
        i['properties']['credits'] = cr.get(2012)
        cr2012.append(cr.get(2012))

with open('ua_topo_with_credits.json', 'w') as outfile:
    json.dump(geo, outfile)

print "max credit:"
print max(cr2012)
print "min credit:"
print min(cr2012)
