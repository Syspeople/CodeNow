function addBuildNumber
{
    param (
        # build number
        [Parameter()]
        [string]
        $buildNumber
    )

    $pgkJson = ConvertFrom-Json -InputObject (Get-Content -Path .\package.json -Raw)

    $pgkJson.version = "$($pgkJson.version)-$($buildNumber)"
    Write-Output $pgkJson

    Set-Content -Path ".\package.json" -Value (ConvertTo-Json -InputObject $pgkJson -Depth 10)
}
