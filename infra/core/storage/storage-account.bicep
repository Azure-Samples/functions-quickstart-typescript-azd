param name string
param location string = resourceGroup().location
param tags object = {}

param allowBlobPublicAccess bool = false
@allowed(['Enabled', 'Disabled', 'SecuredByPerimeter'])
param publicNetworkAccess string = 'Enabled'
param containers array = []
param kind string = 'StorageV2'
param minimumTlsVersion string = 'TLS1_2'
param sku object = { name: 'Standard_LRS' }
param allowedIpAddresses array
param virtualNetworkSubnetId string

var ipRules = [
  for ipAddress in allowedIpAddresses: {
    action: 'Allow'
    value: ipAddress
  }
]

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: name
  location: location
  tags: tags
  kind: kind
  sku: sku
  properties: {
    minimumTlsVersion: minimumTlsVersion
    allowBlobPublicAccess: allowBlobPublicAccess
    publicNetworkAccess: publicNetworkAccess
    allowSharedKeyAccess: false
    defaultToOAuthAuthentication: true
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Deny'
      ipRules: ipRules
      virtualNetworkRules: [
        {
          id: virtualNetworkSubnetId
        }
      ]
    }
  }

  resource blobServices 'blobServices' = if (!empty(containers)) {
    name: 'default'
    resource container 'containers' = [
      for container in containers: {
        name: container.name
        properties: {
          publicAccess: contains(container, 'publicAccess') ? container.publicAccess : 'None'
        }
      }
    ]
  }
}

output name string = storage.name
output primaryEndpoints object = storage.properties.primaryEndpoints
