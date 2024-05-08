export function parseDoctorRequestToJSON(roleValue: string, action: string){
    const dataRequest: any =
    {
        "ReturnPolicyIdList": false,
        "CombinedDecision": false,
        "Category": [
            {
                "CategoryId": "urn:oasis:names:tc:xacml:1.0:subject-category:access-subject",
                "Attribute": [
                    {
                        "AttributeId": "urn:oasis:names:tc:xacml:3.0:example:attribute:role",
                        "Issuer": "med.example.com",
                        "Value": roleValue,
                        "DataType": "http://www.w3.org/2001/XMLSchema#string",
                        "IncludeInResult": false
                    }
                ]
            },
            {
                "CategoryId": "urn:oasis:names:tc:xacml:3.0:attribute-category:resource",
                "Attribute": [
                    {
                        "IncludeInResult": false,
                        "AttributeId": "urn:oasis:names:tc:xacml:2.0:resource:resource-parent",
                        "Value": "file://example/med/record/patient",
                        "DataType": "http://www.w3.org/2001/XMLSchema#anyURI"
                    }
                ]
            },
            {
                "CategoryId": "urn:oasis:names:tc:xacml:3.0:attribute-category:action",
                "Attribute": [
                    {
                        "IncludeInResult": false,
                        "AttributeId": "urn:oasis:names:tc:xacml:1.0:action:action-id",
                        "Value": action,
                        "DataType": "http://www.w3.org/2001/XMLSchema#string"
                    }
                ]
            }
        ]
    }
    return dataRequest;
}