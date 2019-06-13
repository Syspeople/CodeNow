function addBuildNumber
{
    param (
        # build number
        [Parameter()]
        [string]
        $buildNumber
    )

    try
    {
        $pgkJson = ConvertFrom-Json -InputObject (Get-Content -Path .\package.json -Raw)

        $buildNo = $buildNumber.Replace('.', '')

        $pgkJson.version = "$($pgkJson.version).$($buildNo)"
    
        $null = Set-Content -Path ".\package.json" -Value (ConvertTo-Json -InputObject $pgkJson -Depth 10)
    }
    catch
    {
        throw $_
    }
    return $pgkJson.version
}
