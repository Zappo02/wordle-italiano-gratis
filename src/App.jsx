import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATABASE ─────────────────────────────────────────────────────────────────
const DB_RAW = [
  "ABETE","ABITO","ACETO","ACIDO","ACQUA","AGILE","AGLIO","AGIRE","AIUTO","ALITO",
  "ALONE","ALTRO","AMARO","AMBRA","AMICO","AMORE","ANIMA","ANSIA","APICE","ARENA",
  "ARIDO","AROMA","ARPA","ARSO","ARTE","ASINO","ASPRO","ASTRO","ATOMO","AUDIO",
  "AVERE","AVIDO","AVVIO","ABUSO","ADITO","ALARE","ALATO","ALGHE","ALTEA","AMACA",
  "AMEBA","AMENO","AMPIO","ANETO","ANODO","APNEA","ARABO","ARECA","ARNIA","AROMI",
  "ARSIA","ANIME","ALOSA","ARARE","ANCORA",
  "BABBO","BACIO","BANCO","BARCA","BASSO","BELLO","BIRRA","BOCCA","BORDO","BOSCO",
  "BRAVO","BREVE","BUONO","BUSTO","BAGNO","BALDO","BALLA","BALSA","BALZO","BANDA",
  "BARBA","BARDO","BAULE","BAZZA","BELVA","BERTA","BIECO","BIOMA","BIRBO","BISCA",
  "BOBBA","BOCCE","BOLLA","BOMBA","BONGO","BORSA","BOSSO","BRACA","BRAMA","BRANO",
  "BRINA","BRODO","BROMO","BRUGO","BRUNA","BULBO","BULLO","BURLA","BASTO","BALCO",
  "BANDO","BARCO","BEFFA","BERCO","BERTO","BINGO","BIOTA","BISSO","BOFFA",
  "CACCIA","CALDO","CALVO","CAMPO","CANTO","CAPRA","CARTA","CARRO","CASCO","CASSA",
  "CAUSA","CELLA","CERTO","CIELO","CIRCO","COBRA","COLLA","COLLO","COLMO","COLPA",
  "COLPO","CORDA","CORPO","CORSA","CORTE","COSMO","CREMA","CROCE","CUORE","CURVA",
  "CALCE","CALMA","CALMO","CALZA","CAMPA","CANOA","CAPPA","CAPRO","CARMA","CARPA",
  "CARSO","CASTA","CASTO","CAVEA","CAVIA","CAZZO","CEDRO","CENNO","CENSO","CERVO",
  "CESTA","CESTO","CHINA","CIGNO","CIPPO","CIRRO","CLAVA","CLERO","CLIMA","CLONE",
  "CLORO","COCCO","COEVO","COFFA","COMBO","CONCA","CONTA","CONTE","COPIA","COPPA",
  "COPPO","CORNO","CORVO","COSCA","COSTA","COSTO","COZZO","CRASI","CRAVO","CRINI",
  "CRIVO","CROMA","CROMO","CRONO","CRUDA","CRUDO","CUBIA","CULEO","CULMO","CUNEO",
  "CURDO","CURIO","COLTO","COVIO","CORMO","CORRO","CORBO",
  "DANNO","DANZA","DARDO","DENTE","DOSSO","DRAGO","DUOMO","DAINO","DAMMA","DEBOL",
  "DENSO","DISCO","DIODO","DOCCE","DOGMA","DOLCE","DOMBO","DORSO","DRENA","DROGA",
  "DUOLO","DUPLO","DACCA","DAMPA","DARIA","DECIO","DELTO","DESCA","DISMO","DITTO",
  "DOLCO","DOLSO","DORMO","DOSIO","DUONA","DUONI","DUTTO",
  "EBANO","EDERA","ELMO","ERBA","ESAME","ESITO","ESTRO","ETICA","ETNIA","EBETE",
  "ECATE","ECUBA","EDEMA","EGIDA","ELICA","ELIDE","ELISO","EMPIO","EMULO","ENEMA",
  "ENTRO","EPICA","EPOCA","ERNIA","ERODE","EROSE","EROSO","ERUGA","ESODO","ETERE",
  "ETILE","EVASO","EVOCA","EROTO","ESOSA",
  "FANGO","FARRO","FERRO","FESTA","FIATO","FIBRA","FIERO","FIORE","FISSO","FIUME",
  "FOBIA","FOLLA","FOLTO","FONTE","FORZA","FOSSO","FRENO","FUOCO","FURBO","FURIA",
  "FUSTO","FALCO","FALDA","FALLO","FALSA","FALSO","FALZA","FARDA","FARSA","FATTO",
  "FERMA","FERMO","FERSA","FIABA","FIAMO","FIENO","FIGRA","FILMA","FIOCO","FISIO",
  "FLATO","FLEBO","FLEMA","FLORA","FOGNA","FONDI","FONDO","FORCO","FORTE","FRAGA",
  "FRANA","FRATE","FRODE","FUGHE","FUGIO","FULCO","FULGA","FUMIO","FABIO","FADIO",
  "FAGIO","FANNO","FAONA","FARNE","FATTA","FEBIO","FERIO","FERVO","FERZO","FETTO",
  "FIATA","FIGLIO","FILAO","FINCA","FINGO","FIRMO","FISTO","FIUMA","FIUSA","FLOCA",
  "FLORE","FLUTO","FOLIO","FOLMO","FONGA","FORMO","FORTO","FOSIA","FOTIO","FREMA",
  "FRIGO","FRISE","FROLA","FROME","FRONO","FROSA","FRAVO","FULBE",
  "GAMBA","GARZA","GATTO","GENIO","GESTO","GHIRO","GIOCO","GIOIA","GIUSTO","GLOBO",
  "GORGO","GRANO","GRIDO","GUSTO","GABBA","GABLO","GALIO","GALLA","GALLO","GALMO",
  "GAMBO","GANDA","GANNA","GARBA","GARBO","GARMO","GARRA","GARRO","GAUCO","GELIO",
  "GEMMA","GERMA","GERMI","GIBBO","GIMBO","GINCO","GIRMO","GIUDA","GLENA","GNOMO",
  "GOGNA","GOLFO","GOMMA","GONNA","GONZO","GORBA","GOSSA","GOTTO","GOZZO","GRAMO",
  "GRAPA","GREBO","GRECA","GRETO","GRIFO","GRIMO","GRUMO","GUADO","GUAIO","GUANO",
  "GUATA","GUBIA","GUIDA","GUIZO","GENNA","GENOA","GERSA","GILIO","GILDO","GIRON",
  "GIUME","GLOMO","GOLMO","GONDA","GRASA","GREMO","GRESA","GRIGO","GRILE","GRIMA",
  "GRIPO","GRISA","GRISO","GRITA","GRONA","GROPO","GROSA","GROTO","GRUNA",
  "IDOLO","INDIA","IRONIA","ISOLA","ICONA","IGLOO","IMAGO","INCIO","INDIO","INNO",
  "INVIO","IODIO","IRIDE","IRIDO","IRISO","IROSO","ISTMO","IMELO","IMIDE","IMIDO",
  "IMOLO","IPPIE","IPSIA","ISARD","ISCIO",
  "LACCA","LAMPO","LARDO","LARGO","LATTE","LENZA","LEONE","LEPRE","LIBRO","LIMBO",
  "LINCE","LINFA","LISTA","LITRO","LOTTA","LUCRO","LUOGO","LUSSO","LABIO","LABRO",
  "LACCO","LAIDO","LALIO","LAMBA","LAMEN","LAMIA","LAMIO","LAMMA","LANCA","LANGO",
  "LANIA","LANNA","LAPPA","LAPSO","LARMO","LASCE","LASCA","LASMA","LAUTO","LAVRA",
  "LAZIO","LECCO","LEGNO","LEMMA","LENTO","LERMA","LEUCA","LEVIO","LIBIA","LIBIO",
  "LIBRA","LIGIO","LIGNA","LIGNO","LILLA","LIMAO","LIMBE","LIMIO","LIMMA","LINCO",
  "LINGO","LINIO","LINZA","LIOMA","LIRIO","LISCA","LISCO","LISIA","LISIO","LISME",
  "LISSO","LITIO","LIUTO","LIVIO","LIVRO","LOBIO","LOGIO","LOGRO","LOMBA","LOMBO",
  "LONCO","LONDO","LONZA","LOPPA","LORDO","LOSCA","LOSCO","LOTTO","LUCCA","LUCIO",
  "LUGRO","LUMIA","LUMBO","LUMEN","LUNGA","LUNGO","LURCO","LURDO",
  "MAGMA","MALTO","MAPPA","MAZZO","MEZZO","MIELE","MIRTO","MOLLE","MONDO","MONTE",
  "MORSA","MOSSO","MOTTO","MULTA","MACCA","MAGNA","MAGNO","MALGA","MALIO","MALMO",
  "MANCA","MANCO","MANGA","MANIA","MANNA","MANNO","MANTO","MARCA","MARCO","MARMO",
  "MARNA","MARSA","MARZO","MASCA","MASSA","MASSO","MATRO","MAZZA","MEDIO","MELIA",
  "MELIO","MELLO","MELMA","MENSO","MENTA","MENTO","MERCO","MERDA","MERGO","MERLO",
  "MERMA","MERSO","MERTO","MESCA","MESCO","MIGRO","MILEO","MIMEO","MIRCO","MIRMA",
  "MISCA","MISCO","MISSO","MISTO","MITIO","MOGIO","MOGNO","MOINE","MOLIO","MOLLA",
  "MOLLO","MOLSA","MOLSO","MOLZA","MOLZO","MONCO","MONGO","MONNA","MONSA","MONTO",
  "MORBO","MORCO","MORDO","MORMO","MORNO","MORSE","MORSO","MORTO","MORZA","MOSCA",
  "MOSSE","MUCCA","MULCO","MULIO","MULLO","MUNDA","MUNDO","MUNGA","MUNGO","MUNSA",
  "MUNSO","MUNTO","MURBA","MURBO","MURCA","MURCO","MURGA","MURGO","MURSA","MURSO",
  "MURZA","MUSCO","MUSEO","MUSIO","MUSSA","MUSSO","MALSA","MAMBO","MANIO",
  "NARDO","NETTO","NORMA","NOTTE","NABBA","NABBO","NACCA","NACRO","NADIA","NAMBO",
  "NANCA","NANCO","NANGO","NANNA","NANNO","NANSA","NANTO","NAPPO","NARMO","NARSA",
  "NARSO","NASCO","NAUCO","NEGRO","NELMO","NELLO","NEMIA","NENNA","NENNO","NENSA",
  "NENTO","NERBO","NERCO","NERDO","NERNA","NERNO","NERSA","NERSO","NERTO","NERVO",
  "NEVRO","NIMBO","NINFA","NIPPO","NIRVO","NITRO","NOCCA","NOGIO","NORBA","NORCO",
  "NORDO","NORGA","NORNA","NORSA","NORSO","NORTO","NOSSA","NOSSO","NOVIO","NUBIA",
  "NUCCA","NURBA","NURBO","NURCA","NURCO","NURSA","NURSO","NUSSO",
  "OBLIO","OMBRA","OPERA","ORCO","ORLO","ORZO","OSARE","OSSO","OSTIA","ODEON",
  "ODORE","OLIVO","OMERO","OMICO","OPPIA","ORANO","ORCIO","ORMAI","OSTEO","OSTRA",
  "OVAIA","OBELO","OCHIO","OFFIO","OFICO","OLSIO","OLZIO","OMASO","OMINO","OMISA",
  "OMISO","ONCIO","ONDIO","ONFIO","OPACA","OPACO","OPPIO","ORBIO","ORDIO","ORGIO",
  "ORIGO","ORSIA","ORUBA","ORUCA","ORUGA","ORULO","OSARO","OSCIA","OSIMO","OSMIO",
  "OSTIO","OUTRO",
  "PALLA","PALMO","PANNA","PARCO","PASTO","PAURA","PEGNO","PELLE","PERLA","PESCA",
  "PIANO","PIENO","PIZZA","POLSO","POMPA","PORTA","PORTO","POZZO","PRIMA","PROVA",
  "PUNTO","PACCA","PACCO","PADRE","PALCO","PALEO","PALIO","PALSA","PANNO","PAPPO",
  "PARMA","PARNA","PARSO","PARTO","PASCA","PASCO","PASMO","PASSO","PASTA","PATEA",
  "PATIO","PATMO","PATRO","PAZZO","PECCA","PECCO","PEDIO","PELSA","PELSO","PENTO",
  "PERDO","PERIO","PERMA","PERNO","PERSA","PERSO","PERTO","PESIO","PESO","PETTO",
  "PIAGA","PICCA","PICCO","PICIA","PIGIO","PIGNA","PIGNO","PILMA","PILMO","PINCO",
  "PINGO","PINIA","PINSA","PINTO","PINZA","PIOTA","PIPPO","PIRCO","PIRIO","PIRSA",
  "PIRSO","PIRTO","PISCA","PISCO","PISIO","PISMO","PISSO","PISTO","PLANA","PLANO",
  "PLUMA","POCIO","PODIO","POGIO","POLCA","POLCO","POLDO","POLIA","POLIO","POLLO",
  "POLMA","POLMO","POLPA","POLSA","POLVO","POLZA","POMBO","PONCO","PONDO","PONGA",
  "PONGO","PONSA","PONTO","PONZA","POPPA","PORCO","PORGA","PORNO","PORSA","POSCA",
  "POSIO","POSSO","POSTO","POTIO","POTSO","PREDA","PREMO","PRESA","PRESO","PRETO",
  "PREVO","PRIMO","PRIVO","PROBE","PROBO","PRODA","PRODE","PRONA","PRONO","PRORA",
  "PROSA","PROSO","PUGIO","PULCO","PULEO","PULIA","PULIO","PULLO","PULSA","PULSO",
  "PUNCA","PUNCO","PUNGA","PUNGO","PUNSA","PUPPA","PURCA","PURCO","PURGA","PURGO",
  "PURSA","PURSO","PUSCA","PUSCO","PIAMO","PIATO","PICIO","PILAO","PATEO",
  "RADIO","RAZZA","REGNO","RESTO","RETTA","RICCO","RITMO","ROCCA","ROSSO","ROTTA",
  "RUOLO","RUOTA","RUSSO","RABCO","RACCA","RACCO","RADIA","RAGNA","RAGNO","RAINO",
  "RALLO","RALSA","RAMBA","RAMBO","RAMPA","RANCA","RANCO","RANGO","RANNA","RANNO",
  "RANSA","RANTO","RANZA","RAPIO","RAPPA","RAPSO","RASCO","RASIO","RASSA","RASSO",
  "RASTO","RATTO","RAZMA","RAZSO","RAZTO","RECCO","RECTO","REDIO","REGIO","REGMO",
  "RELIO","RELLO","RELSA","RIMBA","RIMBO","RIMPA","RINCA","RINGO","RISCA","RISCO",
  "RISMA","RISSO","RISTO","RITMA","RIUSA","RIUSO","ROGNA","ROGNO","ROMBA","ROMBO",
  "RONCA","RONCO","RONGA","RONGO","RONSA","RONTO","RONZA","RONZO","ROSCO","ROSMA",
  "ROSSA","ROSTO","ROTMA","ROTSA","ROTZO","RULCO","RULLA","RULLO","RUMBA","RUNCO",
  "RUNNA","RUNSO","RUNTO","RUNZA","RUSCA","RUSSA","RUSTO","RODEO","RONDO","RAFFO",
  "RANZO","RASPA","RASPO","REDIA","REZIA","RIBCO","RICMA","RIGMO","RIGNO","RILMO",
  "RILSA","RIMCO","RIMMA","RINCO","RINSA","RINZA","RISIO","RIVCO","RIVMA","ROMCO",
  "ROMMA","ROMSA","RORCA","ROSIO","ROTIO","ROVIO","RUGMA","RUGNA","RUGSA","RULSA",
  "RUMCO","RUMMA","RURBA","RURCO","RURSA",
  "SACRO","SAGRA","SALMO","SALTO","SALVO","SASSO","SCALA","SCENA","SCOPA","SCOPO",
  "SCUDO","SENSO","SERVO","SFERA","SOGNO","SOLCO","SORTE","SOTTO","SPADA","SPIGA",
  "SUOLO","SUONO","SABCO","SABMO","SACCA","SACCO","SADIA","SAGIO","SALIO","SALLO",
  "SALSA","SALSO","SAMBA","SANBO","SANCA","SANCO","SANGO","SANNA","SANNO","SANSA",
  "SANSO","SANTO","SANZA","SAPCO","SAPPE","SAPPO","SARCO","SARIO","SARMA","SARMO",
  "SARPA","SARPO","SARSA","SARSO","SARTO","SAVIA","SAVIO","SECCO","SEDIA","SEGNO",
  "SELIO","SELLO","SELSA","SEMMA","SEMSO","SENNA","SENNO","SESTO","SFIDA","SFOGO",
  "SFUGA","SIENA","SILCO","SILEO","SILIO","SILVA","SIMBA","SIMIO","SINCO","SINGA",
  "SINGO","SINNA","SINNO","SINSA","SINTO","SINZA","SIPMA","SIPMO","SIRCO","SIRIO",
  "SIRSA","SIRSO","SIRTO","SISCA","SISMA","SISSO","SISTO","SITIO","SITMA","SITMO",
  "SITSA","SLOGA","SLOGO","SNODA","SNODO","SOBBA","SODIO","SOLIO","SOLLO","SOLMA",
  "SOLMO","SOLSA","SOLSO","SOLZA","SOMBA","SOMBO","SOMMA","SOMMO","SONCA","SONCO",
  "SONGA","SONGO","SONNA","SONNO","SONTO","SONZA","SOPRA","SORBA","SORBO","SORDA",
  "SORDO","SORGA","SORGO","SORIA","SORMO","SORSA","SORSO","SORTO","SOSCO","SOSSE",
  "SOSSO","SOVCO","STAMO","STARE","STATO","STECO","STELO","STILE","STIMA","STIMO",
  "STIPA","STIPO","STIVA","STOLA","STONA","STOPA","STRIA","STUFA","STUFO","SULCA",
  "SULCO","SULLA","SULLO","SURCO","SURIA","SURIO","SURSA","SURSO","SUSCA","SUSIO",
  "SUSSO","SVAGO","SVELA","SVELO","SVEVA","SVEVO","SABBA","SALSO","SCAMA","SCAMO",
  "SCAPI","SCAPO","SCARO","SCASO","SCATO","SCAVO","SCEMO","SCESO","SCOLA","SCONO",
  "SCORI","SCORO","SCOSA","SCOSO","SCOTO","SCOVA","SCUDA","SECCO","SENCO","SESIO",
  "SIMCO","SIMMA","SIPCO","SIRMA","SIRMO","SISIO","SISMO","SITCO","SITSO","SOBCA",
  "SOBCO","SOBIO","SOMCA","SOMCO","SOMIA","SONSA","SONSO","SOPCO","SOPIO","SORCO",
  "SORMA","SOSTO","SOTCO","SOTIO","SOTMA","SOTSO","STIGA","STIGO","STIVO","STOLO",
  "STONO","STOPO","STORO","STOSA","STOSO","STOTO","STOVA","STRAO","STRIO","STUMA",
  "STUMO","STUPO","SUBCO","SUBMA","SUBMO","SULMA","SULMO","SULSA","SULSO","SUMBA",
  "SUMBO","SUMCA","SUMCO","SUMIA","SUMSA","SURMA","SURMO","SURTO","SURZA","SUSCO",
  "SUSMA","SUSMO","SUSTO","SVEMA","SVEMO","SVESA","SVESO",
  "TACCO","TANGO","TANTO","TARDO","TASTO","TEMPO","TENDA","TERRA","TESTA","TIGRE",
  "TINTO","TONDO","TOPPA","TORTA","TRAMA","TRONO","TUTTO","TABMO","TABSA","TACCA",
  "TAGIO","TAGSA","TALCO","TALEO","TALIO","TALLA","TALLO","TALMA","TALMO","TALPA",
  "TALPO","TALSA","TALSO","TAMBA","TAMBO","TAMCA","TAMCO","TAMIO","TAMMA","TAMMO",
  "TAMPA","TAMPO","TAMSA","TANCA","TANCO","TANGA","TANNA","TANNO","TANSA","TANZA",
  "TAPCO","TAPPA","TAPPO","TAPSO","TARCA","TARCO","TARIO","TARMA","TARMO","TARNA",
  "TARRO","TARSA","TARSO","TARTA","TARZO","TASCA","TASCO","TASIO","TASMA","TASMO",
  "TASSE","TASSO","TATCO","TATIO","TATMA","TATMO","TATSA","TATSO","TATZO","TAZZA",
  "TAZZO","TECCO","TECIA","TEDIO","TEGIO","TELIA","TELIO","TELLA","TELLO","TELMA",
  "TELMO","TELSO","TEMBA","TEMBO","TEMCA","TEMCO","TEMMA","TEMMO","TEMPA","TEMSA",
  "TENCA","TENCO","TENGA","TENGO","TENNA","TENNO","TENSA","TENSO","TENTA","TENTO",
  "TENZA","TERBA","TERBO","TERCA","TERCO","TERGA","TERGO","TERMA","TERMO","TERNA",
  "TERNO","TERSA","TERSO","TERTA","TERZA","TERZO","TESCO","TESMA","TESMO","TESSA",
  "TESSO","TESTO","TINCA","TINCO","TINGA","TINGO","TINNA","TINNO","TINSA","TINSO",
  "TINZA","TIPCO","TIPIO","TIPMA","TIRCO","TIRIA","TIRIO","TIRMA","TIRMO","TIRNA",
  "TIRNO","TIRSA","TIRSO","TIRZA","TISCA","TISCO","TISIO","TISMA","TISSO","TISTO",
  "TOCCA","TOCCO","TOGIO","TOGNA","TOGNO","TOLCA","TOLCO","TOLIO","TOLLA","TOLLO",
  "TOLMA","TOLMO","TOLSA","TOLSO","TOMBA","TOMBO","TOMCA","TOMCO","TOMIA","TOMIO",
  "TOMMA","TOMMO","TOMPA","TOMPO","TONCA","TONCO","TONGA","TONGO","TONNA","TONNO",
  "TONSA","TONSO","TONTO","TONZA","TOPCO","TOPIO","TOPMA","TOPMO","TOPSA","TOPSO",
  "TORBA","TORBO","TORCA","TORCO","TORDA","TORDO","TORGA","TORGO","TORIA","TORIO",
  "TORMA","TORMO","TORNA","TORNO","TORRA","TORSA","TORSO","TORTO","TORVO","TORZA",
  "TOSCA","TOSCO","TOSIA","TOSIO","TOSSA","TOSSO","TOSTO","TRACI","TRAGA","TRAGO",
  "TRAIO","TRAMO","TRAPA","TRASA","TRASO","TRATO","TRAVO","TREGO","TREMO","TRENO",
  "TREPA","TRESA","TRESO","TRETO","TREVO","TRIGI","TRINO","TULCA","TULCO","TULIO",
  "TULLA","TULLO","TULMA","TULMO","TULSA","TULSO","TUMBA","TUMBO","TUMCA","TUMCO",
  "TUMIA","TUMIO","TUMMA","TUMMO","TUMPA","TUNCA","TUNCO","TUNDA","TUNDO","TUNGA",
  "TUNGO","TUNNA","TUNNO","TUNSA","TUNTO","TUNZA","TURBA","TURBO","TURCA","TURCO",
  "TURDA","TURDO","TURGA","TURGO","TURIA","TURIO","TURMA","TURMO","TURNA","TURNO",
  "TURRA","TURSA","TURSO","TURTO","TURZA","TUSCA","TUSCO","TUSIO","TUSMA","TUSMO",
  "TUSSA","TUSSO","TUSTO","TITMO","TITSA","TITCO","TITIO","TITMA","TITTO",
  "ULTRA","UMANO","UMIDO","UNIRE","UNICO","UNITO","URLO","USATO","USCIO","UTILE",
  "ULCIO","ULCMO","ULGIO","ULICO","UCREO","UBLIO","UBRIO","UBICO",
  "VANGA","VANTO","VASTO","VENTO","VERDE","VERSO","VETRO","VIOLA","VISTA","VOLPE",
  "VOLTA","VACCA","VAGIO","VAGMO","VAGSA","VAGSO","VALIO","VALLA","VALLO","VALMA",
  "VALMO","VALPA","VALPO","VALSA","VALSO","VALZA","VALZO","VAMBA","VAMBO","VAMPA",
  "VAMPO","VANCA","VANCO","VANGA","VANNA","VANNO","VANSA","VANSO","VANZA","VAPCO",
  "VAPMO","VARCA","VARCO","VARIA","VARIO","VARMA","VARMO","VARNA","VARNO","VARSA",
  "VARSO","VASCA","VASCO","VASMA","VASMO","VASSA","VASSO","VENCO","VENIA","VENIO",
  "VENMA","VENMO","VENNA","VENNO","VENSA","VENTA","VENZA","VERBA","VERBO","VERCA",
  "VERCO","VERDA","VERDO","VERGA","VERGO","VERIA","VERIO","VERMA","VERMO","VERNA",
  "VERNO","VERRA","VERSA","VERTO","VESCA","VESCO","VESIO","VESMA","VESMO","VESSA",
  "VESSO","VESTA","VESTI","VESTO","VETCO","VETIO","VETMA","VETMO","VETSA","VETSO",
  "VETZA","VIBCO","VIBIO","VIBMA","VIBMO","VICCO","VICIA","VICIO","VIGEO","VIGIA",
  "VIGIO","VIGMA","VIGMO","VIGNA","VIGNO","VILCA","VILCO","VILIA","VILIO","VILLA",
  "VILLO","VILMA","VILMO","VILSA","VILSO","VIRGA","VIRGO","VIRIA","VIRIO","VIRMA",
  "VIRMO","VIRNA","VIRNO","VIRSA","VIRSO","VIRTU","VIRZA","VISCA","VISCO","VISIO",
  "VISMA","VISSO","VITCO","VITIO","VITMA","VITMO","VITSA","VITSO","VIVCO","VIVIO",
  "VIVMA","VIVMO","VOLCA","VOLCO","VOLIO","VOLLA","VOLLO","VOLMA","VOLMO","VOLSA",
  "VOLSO","VOLTO","VOLZA","VOMCO","VOMIO","VOMMA","VOMMO","VORCA","VORCO","VORIO",
  "VORMA","VORMO","VORNA","VORNO","VORSA","VORSO","VORTO","VORZA","VOSCA","VOSCO",
  "VOSIO","VOSMA","VOSMO","VOSSA","VOSSO","VOSTO","VOTCO","VOTIO","VOTMA","VOTMO",
  "VOTSA","VOTSO","VULCO","VULIO","VULLA","VULLO","VULMA","VULMO","VULSA","VULSO",
  "ZAINO","ZAMPA","ZAPPA","ZEBRA","ZUPPA","ZAFCO","ZAGIO","ZALIO","ZAMMA","ZAMMO",
  "ZAMSA","ZANCA","ZANCO","ZANGA","ZANGO","ZANNA","ZANNO","ZANSA","ZANSO","ZANTO",
  "ZANZA","ZAPSA","ZARCO","ZARIO","ZARMA","ZARMO","ZARSA","ZARSO","ZARZA","ZASCA",
  "ZASIO","ZASMA","ZASMO","ZASSO","ZASTO","ZATIO","ZATSA","ZATSO","ZATZA","ZECCA",
  "ZECCO","ZELIA","ZELIO","ZELLA","ZELLO","ZELMA","ZELMO","ZELSA","ZELSO","ZELTO",
  "ZENCO","ZENIA","ZENIO","ZENMA","ZENMO","ZENNA","ZENNO","ZENSA","ZENSO","ZENTO",
  "ZENZA","ZERBA","ZERBO","ZERCA","ZERCO","ZERDA","ZERDO","ZERGA","ZERGO","ZERIA",
  "ZERIO","ZERMA","ZERMO","ZERNA","ZERNO","ZERSA","ZERSO","ZERZA","ZIBCO","ZIBIO",
  "ZILLA","ZILLO","ZILMA","ZILMO","ZILSA","ZILSO","ZIMBA","ZIMBO","ZIMIA","ZIMIO",
  "ZIMMA","ZIMMO","ZINCA","ZINCO","ZINGA","ZINGO","ZINNA","ZINNO","ZINSA","ZINSO",
  "ZINTO","ZINZA","ZIPCO","ZIPIO","ZIPMA","ZIRCO","ZIRIO","ZIRMA","ZIRMO","ZIRSA",
  "ZIRSO","ZIRTO","ZIRZA","ZISCA","ZISCO","ZISIO","ZISMO","ZISSA","ZISSO","ZISTO",
  "ZOCCO","ZOCIO","ZOLIA","ZOLIO","ZOLLA","ZOLLO","ZOLMA","ZOLMO","ZOLSA","ZOLSO",
  "ZOMCA","ZOMCO","ZOMIA","ZOMIO","ZOMMA","ZOMMO","ZONCA","ZONCO","ZONGA","ZONGO",
  "ZONNA","ZONNO","ZONSA","ZONSO","ZONTO","ZONZA","ZORCA","ZORCO","ZORIA","ZORIO",
  "ZORMA","ZORMO","ZORSA","ZORSO","ZORZA","ZOSCA","ZUSCA","ZUSCO","ZUSIO","ZUSTO",
];

function normStr(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Z]/g,"");
}
const WORDLE_POOL = [...new Set(DB_RAW.map(normStr).filter(w => w.length === 5))];
const POOL_SIZE = WORDLE_POOL.length;

// ─── SEED ────────────────────────────────────────────────────────────────────
function getWordleWord(seed) {
  let s = (seed + 100001) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  return WORDLE_POOL[s % POOL_SIZE];
}
const EPOCH = new Date("2020-01-01");
function seedFromDate(d) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function dayNum(d) {
  return (Math.floor((d - EPOCH) / 86400000) % POOL_SIZE) + 1;
}

// ─── EVALUATE ────────────────────────────────────────────────────────────────
function evaluate(guess, target) {
  const result = Array(5).fill("absent");
  const tArr = target.split(""), gArr = guess.split(""), used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) if (gArr[i] === tArr[i]) { result[i] = "correct"; used[i] = true; }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && gArr[i] === tArr[j]) { result[i] = "present"; used[j] = true; break; }
    }
  }
  return result;
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function spawnConfetti() {
  const colors = ["#6aaa64","#c9b458","#538d4e","#b59f3b","#ffffff","#85c0f9"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;top:0;left:${Math.random()*100}vw;
      width:${6+Math.random()*6}px;height:${8+Math.random()*8}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>.5?"50%":"2px"};pointer-events:none;z-index:9999;
      animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #121213;
  --surface: #1a1a1b;
  --border: #3a3a3c;
  --text: #ffffff;
  --muted: #818384;
  --correct: #6aaa64;
  --present: #c9b458;
  --absent: #787c7e;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* ── Animazioni ── */
@keyframes confettiFall {
  0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes flipDown {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}
@keyframes flipUp {
  0%   { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg); }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-5px); }
  40%,80% { transform: translateX(5px); }
}
@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Header ── */
.header {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.header-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px;
  letter-spacing: 4px;
}
.header-sub {
  font-size: 11px;
  color: var(--muted);
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 1px;
  text-align: center;
}
.icon-btn {
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 20px; padding: 4px;
  transition: color .2s;
  line-height: 1;
}
.icon-btn:hover { color: var(--text); }
.header-btns { display: flex; gap: 8px; }

/* ── Toast ── */
.toast-container {
  position: fixed; top: 64px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  z-index: 100; pointer-events: none;
}
.toast {
  background: var(--text); color: var(--bg);
  font-weight: 700; font-size: 14px;
  padding: 10px 18px; border-radius: 6px;
  animation: fadeIn .2s ease both;
}

/* ── Layout centrale: griglia + tastiera compatti ── */
.game-area {
  flex: 1;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 8px 12px;
  overflow: hidden;
}

/* ── Board ── */
.board {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.board.shake { animation: shake .4s ease; }
.board-row { display: flex; gap: 5px; }

/* ── Celle ── */
.cell {
  width: 58px; height: 58px;
  position: relative;
  flex-shrink: 0;
}
.cell-face {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30px;
  border: 2px solid var(--border);
  background: var(--bg); color: var(--text);
  user-select: none;
}
.cell.filled .cell-face { border-color: #565758; animation: pop .1s ease; }
.cell.revealed .cell-face {
  background: var(--status); border-color: var(--status); color: #fff;
}
/* Flip fase 1 — scende, una cella per volta */
.cell.flip-down .cell-face {
  animation: flipDown .2s ease var(--delay) both;
}
/* Flip fase 2 — risale con colore, una cella per volta */
.cell.flip-up .cell-face {
  background: var(--status); border-color: var(--status); color: #fff;
  transform: rotateX(-90deg);
  animation: flipUp .2s ease var(--delay) both;
}

/* ── Tastiera ── */
.keyboard {
  width: 100%;
  display: flex; flex-direction: column; gap: 6px;
  flex-shrink: 0;
}
.kb-row { display: flex; justify-content: center; gap: 5px; }
.kb-key {
  height: 54px; min-width: 38px; max-width: 38px; flex: 1;
  border-radius: 4px; border: none;
  background: #818384; color: #fff;
  font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: background .3s, transform .1s;
  user-select: none;
}
.kb-key.wide { min-width: 60px; max-width: 60px; font-size: 11px; }
.kb-key:active { transform: scale(.95); }
.kb-key.kb-correct { background: var(--correct); }
.kb-key.kb-present { background: var(--present); }
.kb-key.kb-absent  { background: #3a3a3c; }

/* ── Modal ── */
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; animation: fadeIn .2s ease;
}
.modal {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  width: 90%; max-width: 380px; padding: 24px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  animation: slideUp .3s ease;
}
.modal h2 { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 2px; }
.modal p  { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.5; }
.modal-word {
  font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px;
  color: var(--correct);
}
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; width: 100%; }
.stat-box { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 30px; }
.stat-label { font-size: 10px; color: var(--muted); text-align: center; }
.dist-wrap { width: 100%; }
.dist-row { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 4px; }
.dist-num { width: 12px; text-align: right; color: var(--muted); font-weight: 700; }
.dist-bar {
  height: 18px; min-width: 18px; background: var(--absent); border-radius: 3px;
  display: flex; align-items: center; justify-content: flex-end; padding-right: 5px;
  font-size: 11px; font-weight: 700; transition: width .5s ease;
}
.dist-bar.current { background: var(--correct); }
.btn {
  padding: 11px 22px; border-radius: 6px; border: none;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: opacity .2s, transform .1s;
}
.btn:active { transform: scale(.97); }
.btn-primary   { background: var(--correct); color: #fff; }
.btn-secondary { background: var(--border); color: var(--text); }
.btn-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.share-box {
  background: var(--bg); border-radius: 8px; padding: 10px 14px;
  font-family: monospace; font-size: 17px; letter-spacing: 2px;
  line-height: 1.4; text-align: center; border: 1px solid var(--border); white-space: pre;
}
.tutorial-examples { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.tutorial-row { display: flex; gap: 4px; justify-content: center; }
.tutorial-cell {
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif; font-size: 24px;
  border: 2px solid var(--border); border-radius: 3px;
}
.tutorial-cell.correct { background: var(--correct); border-color: var(--correct); }
.tutorial-cell.present { background: var(--present); border-color: var(--present); }
.tutorial-cell.absent  { background: var(--absent);  border-color: var(--absent);  }
.archive-wrap {
  display: flex; flex-wrap: wrap; gap: 6px;
  max-height: 180px; overflow-y: auto; padding: 4px;
}
.chip {
  padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  cursor: pointer; border: none; background: var(--border); color: var(--text);
  transition: background .2s;
}
.chip:hover { background: #5a5a5c; }
.chip.today { background: var(--correct); color: #fff; }

/* ── Responsive piccoli schermi ── */
@media (max-height: 700px) {
  .cell { width: 50px; height: 50px; }
  .cell-face { font-size: 26px; }
  .kb-key { height: 46px; }
  .game-area { gap: 8px; }
}
@media (max-width: 360px) {
  .cell { width: 50px; height: 50px; }
  .cell-face { font-size: 26px; }
  .kb-key { min-width: 32px; max-width: 32px; font-size: 10px; height: 48px; }
  .kb-key.wide { min-width: 52px; max-width: 52px; }
}
`;

// ─── COSTANTI ────────────────────────────────────────────────────────────────
const LS = "wi_", RESET_FLAG = "wi_reset_v1", MAX_GUESSES = 6;
const WIN_MSGS = ["Perfetto! 🎯","Brillante! ✨","Ottimo! 💪","Bravo! 🎉","Ce l'hai fatta!","Salvato in extremis 😅"];
const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["INVIO","Z","X","C","V","B","N","M","⌫"]
];

// Ogni cella flip: 200ms animazione + 300ms delay tra celle = ~300ms per cella
// Cella 0: delay 0ms, cella 1: 300ms, ..., cella 4: 1200ms
// Fine fase: 1200 + 200 = 1400ms per fase → totale ~2800ms
const FLIP_CELL_STEP = 300;   // ms tra l'inizio di ogni cella
const FLIP_ANIM_MS   = 200;   // durata animazione singola cella (uguale al CSS)
const FLIP_PHASE_TOTAL = (5 - 1) * FLIP_CELL_STEP + FLIP_ANIM_MS + 50; // ~1450ms

function statusColor(s) {
  if (s === "correct") return "var(--correct)";
  if (s === "present") return "var(--present)";
  if (s === "absent")  return "var(--absent)";
  return "transparent";
}

function Keyboard({ onKey, letterStates }) {
  return (
    <div className="keyboard">
      {KB_ROWS.map((row, ri) => (
        <div className="kb-row" key={ri}>
          {row.map(k => {
            const st = letterStates[k] || "";
            return (
              <button key={k}
                className={`kb-key${k.length > 1 ? " wide" : ""}${st ? ` kb-${st}` : ""}`}
                onClick={() => onKey(k)}>
                {k}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [target, setTarget]         = useState("");
  const [wordNum, setWordNum]       = useState(1);
  const [archiveDate, setArchiveDate] = useState(null);
  const [guesses, setGuesses]       = useState([]);
  const [flipping, setFlipping]     = useState(null); // {word, result, phase:"down"|"up"}
  const [current, setCurrent]       = useState("");
  const [gameOver, setGameOver]     = useState(false);
  const [won, setWon]               = useState(false);
  const [toasts, setToasts]         = useState([]);
  const [shaking, setShaking]       = useState(false);
  const [modal, setModal]           = useState(null);
  const [stats, setStats]           = useState({
    played:0, wins:0, streak:0, maxStreak:0,
    dist:{1:0,2:0,3:0,4:0,5:0,6:0}
  });
  const [hardMode, setHardMode]     = useState(false);
  const guessesRef = useRef(guesses);
  useEffect(() => { guessesRef.current = guesses; }, [guesses]);

  // ── Init ──
  useEffect(() => {
    if (!localStorage.getItem(RESET_FLAG)) {
      Object.keys(localStorage).filter(k => k.startsWith(LS)).forEach(k => localStorage.removeItem(k));
      localStorage.setItem(RESET_FLAG, "1");
    }
    try { const s = JSON.parse(localStorage.getItem(LS+"stats")||"null"); if(s) setStats(s); } catch {}
    setHardMode(localStorage.getItem(LS+"hard") === "1");
    if (!localStorage.getItem(LS+"seen_tutorial")) {
      setModal("tutorial");
      localStorage.setItem(LS+"seen_tutorial", "1");
    }
  }, []);

  // ── Carica partita ──
  const loadGame = useCallback((date) => {
    const seed = seedFromDate(date);
    setTarget(getWordleWord(seed));
    setWordNum(dayNum(date));
    setFlipping(null); setCurrent("");
    try {
      const saved = JSON.parse(localStorage.getItem(LS+"game_"+seed)||"null");
      if (saved && Array.isArray(saved.guesses) && saved.guesses.length > 0) {
        setGuesses(saved.guesses); setWon(saved.won||false); setGameOver(saved.gameOver||false);
      } else { setGuesses([]); setWon(false); setGameOver(false); }
    } catch { setGuesses([]); setWon(false); setGameOver(false); }
  }, []);

  useEffect(() => { loadGame(archiveDate || new Date()); }, [archiveDate, loadGame]);

  // ── Salva ──
  useEffect(() => {
    if (!target) return;
    const seed = seedFromDate(archiveDate || new Date());
    localStorage.setItem(LS+"game_"+seed, JSON.stringify({ guesses, won, gameOver }));
  }, [guesses, won, gameOver, target, archiveDate]);

  // ── Toast ──
  const toast = useCallback((msg, dur=2000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [{id,msg}, ...t]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), dur);
  }, []);

  // ── Lettera stati ──
  const letterStates = (() => {
    const map = {};
    const all = [...guesses, ...(flipping ? [flipping] : [])];
    for (const g of all) {
      if (!g.result) continue;
      g.result.forEach((r, i) => {
        const l = g.word[i], prev = map[l];
        if (prev === "correct") return;
        if (r === "correct" || !prev || (r === "present" && prev === "absent")) map[l] = r;
      });
    }
    return map;
  })();

  // ── Flip lento: cella per cella ──
  // delay per ogni cella = col * FLIP_CELL_STEP
  // Fase "down": tutte e 5 le celle scendono in sequenza
  // Dopo FLIP_PHASE_TOTAL ms → fase "up": risalgono con colore
  // Dopo altri FLIP_PHASE_TOTAL ms → fine, aggiungi a guesses
  function runFlip(newGuess, onDone) {
    setFlipping({ ...newGuess, phase: "down" });
    setTimeout(() => {
      setFlipping({ ...newGuess, phase: "up" });
      setTimeout(() => {
        setFlipping(null);
        onDone();
      }, FLIP_PHASE_TOTAL);
    }, FLIP_PHASE_TOTAL);
  }

  // ── Submit ──
  const submitGuess = useCallback(() => {
    if (gameOver || flipping) return;
    const norm = current.toUpperCase().replace(/[^A-Z]/g, "");
    if (norm.length !== 5) {
      toast("La parola deve avere 5 lettere");
      setShaking(true); setTimeout(() => setShaking(false), 400);
      return;
    }
    if (hardMode && guessesRef.current.length > 0) {
      const last = guessesRef.current[guessesRef.current.length - 1];
      for (let i = 0; i < 5; i++) {
        if (last.result[i] === "correct" && norm[i] !== last.word[i]) {
          toast(`La ${i+1}ª lettera deve essere ${last.word[i]}`);
          setShaking(true); setTimeout(() => setShaking(false), 400);
          return;
        }
      }
      const pn = last.word.split("").filter((_,i) => last.result[i] === "present");
      for (const l of pn) {
        if (!norm.includes(l)) {
          toast(`La parola deve contenere ${l}`);
          setShaking(true); setTimeout(() => setShaking(false), 400);
          return;
        }
      }
    }
    const result = evaluate(norm, target);
    const newGuess = { word: norm, result };
    const attemptNum = guessesRef.current.length + 1;
    setCurrent("");
    runFlip(newGuess, () => {
      setGuesses(prev => {
        const next = [...prev, newGuess];
        const isWin = result.every(r => r === "correct");
        const isLose = !isWin && next.length >= MAX_GUESSES;
        if (isWin) {
          setWon(true); setGameOver(true);
          spawnConfetti();
          toast(WIN_MSGS[Math.min(attemptNum - 1, WIN_MSGS.length - 1)], 2500);
          updateStats(true, attemptNum);
          setTimeout(() => setModal("end"), 2000);
        } else if (isLose) {
          setGameOver(true);
          toast(target, 3500);
          updateStats(false, 0);
          setTimeout(() => setModal("end"), 3000);
        }
        return next;
      });
    });
  }, [gameOver, flipping, current, target, hardMode, toast]);

  function updateStats(win, guessCount) {
    setStats(prev => {
      const d = { ...prev.dist };
      if (win) d[guessCount] = (d[guessCount] || 0) + 1;
      const streak = win ? prev.streak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);
      const next = { played: prev.played+1, wins: prev.wins+(win?1:0), streak, maxStreak, dist: d };
      localStorage.setItem(LS+"stats", JSON.stringify(next));
      return next;
    });
  }

  // ── Tastiera fisica ──
  const handleKey = useCallback((k) => {
    if (gameOver || flipping) return;
    if (k === "⌫" || k === "Backspace") { setCurrent(c => c.slice(0, -1)); }
    else if (k === "INVIO" || k === "Enter") { submitGuess(); }
    else if (/^[A-Za-z]$/.test(k) && current.length < 5) { setCurrent(c => c + k.toUpperCase()); }
  }, [gameOver, flipping, current, submitGuess]);

  useEffect(() => {
    const fn = (e) => handleKey(e.key === "Backspace" ? "⌫" : e.key === "Enter" ? "INVIO" : e.key);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleKey]);

  // ── Share ──
  function buildShare() {
    const h = `🇮🇹 Wordle Italiano #${wordNum}\n`;
    const r = guesses.map(g => g.result.map(r => r==="correct"?"🟩":r==="present"?"🟨":"⬛").join("")).join("\n");
    return h + r + (won ? "" : " X") + `/${MAX_GUESSES}`;
  }

  // ── Render griglia ──
  function renderRows() {
    const rows = [];
    for (let r = 0; r < MAX_GUESSES; r++) {
      if (r < guesses.length) {
        const g = guesses[r];
        rows.push(
          <div className="board-row" key={r}>
            {g.word.split("").map((l, i) => (
              <div key={i} className="cell revealed"
                style={{ "--status": statusColor(g.result[i]) }}>
                <div className="cell-face">{l}</div>
              </div>
            ))}
          </div>
        );
      } else if (flipping && r === guesses.length) {
        rows.push(
          <div className="board-row" key={r}>
            {flipping.word.split("").map((l, i) => (
              <div key={i}
                className={`cell flip-${flipping.phase}`}
                style={{
                  "--delay": `${i * FLIP_CELL_STEP}ms`,
                  "--status": statusColor(flipping.result[i])
                }}>
                <div className="cell-face">{l}</div>
              </div>
            ))}
          </div>
        );
      } else if (!gameOver && !flipping && r === guesses.length) {
        const letters = current.padEnd(5, " ").split("");
        rows.push(
          <div className="board-row" key={r}>
            {letters.map((l, i) => (
              <div key={i} className={`cell${l !== " " ? " filled" : ""}`}>
                <div className="cell-face">{l === " " ? "" : l}</div>
              </div>
            ))}
          </div>
        );
      } else {
        rows.push(
          <div className="board-row" key={r}>
            {Array(5).fill("").map((_, i) => (
              <div key={i} className="cell"><div className="cell-face"></div></div>
            ))}
          </div>
        );
      }
    }
    return rows;
  }

  // ── Modali ──
  function ModalStats() {
    const maxBar = Math.max(...Object.values(stats.dist), 1);
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>📊 Statistiche</h2>
          <div className="stats-grid">
            <div className="stat-box"><span className="stat-num">{stats.played}</span><span className="stat-label">Partite</span></div>
            <div className="stat-box"><span className="stat-num">{stats.played ? Math.round(stats.wins/stats.played*100) : 0}%</span><span className="stat-label">Vittorie</span></div>
            <div className="stat-box"><span className="stat-num">{stats.streak}</span><span className="stat-label">Serie</span></div>
            <div className="stat-box"><span className="stat-num">{stats.maxStreak}</span><span className="stat-label">Migliore</span></div>
          </div>
          <div className="dist-wrap">
            {[1,2,3,4,5,6].map(n => (
              <div className="dist-row" key={n}>
                <span className="dist-num">{n}</span>
                <div className={`dist-bar${guesses.length===n&&won?" current":""}`}
                  style={{ width: `${Math.max(18, (stats.dist[n]||0)/maxBar*170)}px` }}>
                  {stats.dist[n]||0}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Chiudi</button>
        </div>
      </div>
    );
  }

  function ModalTutorial() {
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>Come si gioca</h2>
          <p>Indovina la parola in 6 tentativi.<br/>Ogni tentativo deve essere di 5 lettere.</p>
          <div className="tutorial-examples">
            <p style={{fontSize:"12px",color:"var(--muted)"}}>🟩 Lettera corretta nella posizione giusta</p>
            <div className="tutorial-row">
              {["P","I","A","N","O"].map((l,i) => (
                <div key={i} className={`tutorial-cell${i===0?" correct":""}`}>{l}</div>
              ))}
            </div>
            <p style={{fontSize:"12px",color:"var(--muted)"}}>🟨 Lettera presente ma in posizione sbagliata</p>
            <div className="tutorial-row">
              {["F","I","U","M","E"].map((l,i) => (
                <div key={i} className={`tutorial-cell${i===2?" present":""}`}>{l}</div>
              ))}
            </div>
            <p style={{fontSize:"12px",color:"var(--muted)"}}>⬛ Lettera non presente nella parola</p>
            <div className="tutorial-row">
              {["V","E","N","T","O"].map((l,i) => (
                <div key={i} className={`tutorial-cell${i===3?" absent":""}`}>{l}</div>
              ))}
            </div>
          </div>
          <p>Una nuova parola ogni giorno!</p>
          <button className="btn btn-primary" onClick={() => setModal(null)}>Inizia!</button>
        </div>
      </div>
    );
  }

  function ModalEnd() {
    const [copied, setCopied] = useState(false);
    const text = buildShare();
    function copy() {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>{won ? "🎉 Hai vinto!" : "😔 Peccato"}</h2>
          {!won && <><p>La parola era:</p><div className="modal-word">{target}</div></>}
          <div className="share-box">{text}</div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={copy}>{copied ? "✓ Copiato!" : "Condividi"}</button>
            <button className="btn btn-secondary" onClick={() => setModal("stats")}>Statistiche</button>
            <button className="btn btn-secondary" onClick={() => setModal("archive")}>Archivio</button>
          </div>
        </div>
      </div>
    );
  }

  function ModalArchive() {
    const chips = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const label = i === 0 ? "Oggi" : d.toLocaleDateString("it-IT", {day:"2-digit",month:"2-digit"});
      chips.push({ d, label, isToday: i === 0 });
    }
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>📅 Archivio</h2>
          <p>Gioca le sfide degli ultimi 30 giorni</p>
          <div className="archive-wrap">
            {chips.map(({ d, label, isToday }, i) => (
              <button key={i} className={`chip${isToday ? " today" : ""}`}
                onClick={() => { setArchiveDate(isToday ? null : d); setModal(null); }}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Chiudi</button>
        </div>
      </div>
    );
  }

  function toggleHard() {
    if (guesses.length > 0) { toast("Impossibile cambiare durante la partita"); return; }
    const next = !hardMode; setHardMode(next);
    localStorage.setItem(LS+"hard", next ? "1" : "0");
    toast(next ? "Modalità difficile attivata 🔥" : "Modalità normale");
  }

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ width:"100%", maxWidth:"500px", height:"100dvh", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <header className="header">
          <button className="icon-btn" onClick={() => setModal("tutorial")}>?</button>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span className="header-title">🇮🇹 WORDLE ITALIANO</span>
            <span className="header-sub">#{wordNum}</span>
          </div>
          <div className="header-btns">
            <button className="icon-btn" onClick={toggleHard}
              style={{ fontSize:"16px", color: hardMode ? "#f5a000" : "var(--muted)" }}>🔥</button>
            <button className="icon-btn" onClick={() => setModal("stats")}>📊</button>
            <button className="icon-btn" onClick={() => setModal("archive")}>📅</button>
          </div>
        </header>

        {/* Toast */}
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
        </div>

        {/* Griglia + Tastiera centrate */}
        <div className="game-area">
          <div className={`board${shaking ? " shake" : ""}`}>
            {renderRows()}
          </div>
          <Keyboard onKey={handleKey} letterStates={letterStates} />
        </div>

      </div>

      {modal === "tutorial" && <ModalTutorial />}
      {modal === "stats"    && <ModalStats />}
      {modal === "end"      && <ModalEnd />}
      {modal === "archive"  && <ModalArchive />}
    </>
  );
}

