![ Anno 1404 Logo ](logo.jpg)

# Anno 1404 for personal use

Calculator for Anno 1404 game

## tech staff

uses pure JavaScript with no extensions

db.json to obtain multipliers, photos and needs

uses localStorage to save state with current number of inhabitants and multipliers

## features

you can download your own XML content with needed data

XML example:
```xml
<Anno1404Calculator version="1.0" exportDate="2025-07-15T22:37:45.048Z">
    <Inhabitants>
        <Inhabitant index="0" type="beggar" count="3000"/>
        <Inhabitant index="3" type="patrician" count="1150"/>
        <Inhabitant index="4" type="nobleman" count="840"/>
    </Inhabitants>
    <Multipliers>
        <Multiplier index="0" goodType="fish" value="50"/>
        <Multiplier index="1" goodType="spices" value="25"/>
        <Multiplier index="2" goodType="bread" value="25"/>
        <Multiplier index="3" goodType="meat" value="25"/>
        <Multiplier index="4" goodType="cider" value="25"/>
        <Multiplier index="5" goodType="beer" value="25"/>
        <Multiplier index="6" goodType="wine" value="25"/>
        <Multiplier index="7" goodType="linen_garments" value="25"/>
        <Multiplier index="8" goodType="leather_jerkins" value="25"/>
        <Multiplier index="10" goodType="brocade_robes" value="25"/>
        <Multiplier index="11" goodType="books" value="25"/>
        <Multiplier index="12" goodType="candlesticks" value="25"/>
        <Multiplier index="13" goodType="glasses" value="25"/>
        <Multiplier index="14" goodType="dates" value="25"/>
        <Multiplier index="15" goodType="milk" value="25"/>
        <Multiplier index="16" goodType="carpets" value="25"/>
        <Multiplier index="17" goodType="coffee" value="25"/>
        <Multiplier index="18" goodType="pearl_necklaces" value="25"/>
        <Multiplier index="19" goodType="parfumes" value="25"/>
        <Multiplier index="20" goodType="marzipans" value="25"/>
    </Multipliers>
    <MemorizedAmounts>
        <MemorizedAmount index="0" goodType="fish" amount="1"/>
        <MemorizedAmount index="1" goodType="spices" amount="2"/>
        <MemorizedAmount index="2" goodType="bread" amount="2"/>
        <MemorizedAmount index="4" goodType="cider" amount="2"/>
        <MemorizedAmount index="5" goodType="beer" amount="2"/>
        <MemorizedAmount index="7" goodType="linen_garments" amount="2"/>
        <MemorizedAmount index="8" goodType="leather_jerkins" amount="1"/>
        <MemorizedAmount index="11" goodType="books" amount="1"/>
    </MemorizedAmounts>
    <Metadata calculatorVersion="2.0" gameVersion="Anno1404"/>
</Anno1404Calculator>
```
you can download CSV file with needs from Supply page

## how to run

this project must be run via a local web server due to browser restrictions on loading local json files.
I highly recommend LiveServer, in-built extension in vscode for this reason

