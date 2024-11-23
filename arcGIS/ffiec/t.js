let nirCategories = [
    {
        name: "RISK",
        alias: "Composite Climate",
        cols: [
            {
                name: "RISK_VALUE",
                alias: "National Risk Index - Value - Composite",
                type: "double",
            },
            {
                name: "RISK_SCORE",
                alias: "National Risk Index - Score - Composite",
                type: "double",
            },
            {
                name: "RISK_RATNG",
                alias: "National Risk Index - Rating - Composite",
                type: "string",
            },
            {
                name: "RISK_SPCTL",
                alias: "National Risk Index - State Percentile - Composite",
                type: "double",
            },
        ],
    },
    {
        name: "EAL",
        alias: "Expected Annual Loss",
        cols: [
            {
                name: "EAL_SCORE",
                alias: "Expected Annual Loss - Score - Composite",
                type: "double",
            },
            {
                name: "EAL_RATNG",
                alias: "Expected Annual Loss - Rating - Composite",
                type: "string",
            },
            {
                name: "EAL_SPCTL",
                alias: "Expected Annual Loss - State Percentile - Composite",
                type: "double",
            },
            {
                name: "EAL_VALT",
                alias: "Expected Annual Loss - Total - Composite",
                type: "double",
            },
            {
                name: "EAL_VALB",
                alias: "Expected Annual Loss - Building Value - Composite",
                type: "double",
            },
            {
                name: "EAL_VALP",
                alias: "Expected Annual Loss - Population - Composite",
                type: "double",
            },
            {
                name: "EAL_VALPE",
                alias: "Expected Annual Loss - Population Equivalence - Composite",
                type: "double",
            },
            {
                name: "EAL_VALA",
                alias: "Expected Annual Loss - Agriculture Value - Composite",
                type: "double",
            },
        ],
    },
    {
        name: "SOVI",
        alias: "Social Vulnerability",
        cols: [
            {
                name: "SOVI_SCORE",
                alias: "Social Vulnerability - Score",
                type: "double",
            },
            {
                name: "SOVI_RATNG",
                alias: "Social Vulnerability - Rating",
                type: "string",
            },
            {
                name: "SOVI_SPCTL",
                alias: "Social Vulnerability - State Percentile",
                type: "double",
            },
        ],
    },
    {
        name: "RESL",
        alias: "Community Resilience",
        cols: [
            {
                name: "RESL_SCORE",
                alias: "Community Resilience - Score",
                type: "double",
            },
            {
                name: "RESL_RATNG",
                alias: "Community Resilience - Rating",
                type: "string",
            },
            {
                name: "RESL_SPCTL",
                alias: "Community Resilience - State Percentile",
                type: "double",
            },
            {
                name: "RESL_VALUE",
                alias: "Community Resilience - Value",
                type: "double",
            },
        ],
    },
    {
        name: "AVLN",
        alias: "Avalanche",
        cols: [
            {
                name: "AVLN_EVNTS",
                alias: "Avalanche - Number of Events",
                type: "double",
            },
            {
                name: "AVLN_AFREQ",
                alias: "Avalanche - Annualized Frequency",
                type: "double",
            },
            {
                name: "AVLN_EXP_AREA",
                alias: "Avalanche - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "AVLN_EXPB",
                alias: "Avalanche - Exposure - Building Value",
                type: "double",
            },
            {
                name: "AVLN_EXPP",
                alias: "Avalanche - Exposure - Population",
                type: "double",
            },
            {
                name: "AVLN_EXPPE",
                alias: "Avalanche - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "AVLN_EXPT",
                alias: "Avalanche - Exposure - Total",
                type: "double",
            },
            {
                name: "AVLN_HLRB",
                alias: "Avalanche - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "AVLN_HLRP",
                alias: "Avalanche - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "AVLN_HLRR",
                alias: "Avalanche - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "AVLN_EALB",
                alias: "Avalanche - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "AVLN_EALP",
                alias: "Avalanche - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "AVLN_EALPE",
                alias: "Avalanche - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "AVLN_EALT",
                alias: "Avalanche - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "AVLN_EALS",
                alias: "Avalanche - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "AVLN_EALR",
                alias: "Avalanche - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "AVLN_ALRB",
                alias: "Avalanche - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "AVLN_ALRP",
                alias: "Avalanche - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "AVLN_ALR_NPCTL",
                alias: "Avalanche - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "AVLN_RISKV",
                alias: "Avalanche - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "AVLN_RISKS",
                alias: "Avalanche - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "AVLN_RISKR",
                alias: "Avalanche - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "CFLD",
        alias: "Coastal Flooding",
        cols: [
            {
                name: "CFLD_EVNTS",
                alias: "Coastal Flooding - Number of Events",
                type: "double",
            },
            {
                name: "CFLD_AFREQ",
                alias: "Coastal Flooding - Annualized Frequency",
                type: "double",
            },
            {
                name: "CFLD_EXP_AREA",
                alias: "Coastal Flooding - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "CFLD_EXPB",
                alias: "Coastal Flooding - Exposure - Building Value",
                type: "double",
            },
            {
                name: "CFLD_EXPP",
                alias: "Coastal Flooding - Exposure - Population",
                type: "double",
            },
            {
                name: "CFLD_EXPPE",
                alias: "Coastal Flooding - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "CFLD_EXPT",
                alias: "Coastal Flooding - Exposure - Total",
                type: "double",
            },
            {
                name: "CFLD_HLRB",
                alias: "Coastal Flooding - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "CFLD_HLRP",
                alias: "Coastal Flooding - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "CFLD_HLRR",
                alias: "Coastal Flooding - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "CFLD_EALB",
                alias: "Coastal Flooding - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "CFLD_EALP",
                alias: "Coastal Flooding - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "CFLD_EALPE",
                alias: "Coastal Flooding - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "CFLD_EALT",
                alias: "Coastal Flooding - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "CFLD_EALS",
                alias: "Coastal Flooding - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "CFLD_EALR",
                alias: "Coastal Flooding - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "CFLD_ALRB",
                alias: "Coastal Flooding - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "CFLD_ALRP",
                alias: "Coastal Flooding - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "CFLD_ALR_NPCTL",
                alias: "Coastal Flooding - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "CFLD_RISKV",
                alias: "Coastal Flooding - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "CFLD_RISKS",
                alias: "Coastal Flooding - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "CFLD_RISKR",
                alias: "Coastal Flooding - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "CWAV",
        alias: "Cold Wave",
        cols: [
            {
                name: "CWAV_EVNTS",
                alias: "Cold Wave - Number of Events",
                type: "double",
            },
            {
                name: "CWAV_AFREQ",
                alias: "Cold Wave - Annualized Frequency",
                type: "double",
            },
            {
                name: "CWAV_EXP_AREA",
                alias: "Cold Wave - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "CWAV_EXPB",
                alias: "Cold Wave - Exposure - Building Value",
                type: "double",
            },
            {
                name: "CWAV_EXPP",
                alias: "Cold Wave - Exposure - Population",
                type: "double",
            },
            {
                name: "CWAV_EXPPE",
                alias: "Cold Wave - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "CWAV_EXPA",
                alias: "Cold Wave - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "CWAV_EXPT",
                alias: "Cold Wave - Exposure - Total",
                type: "double",
            },
            {
                name: "CWAV_HLRB",
                alias: "Cold Wave - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "CWAV_HLRP",
                alias: "Cold Wave - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "CWAV_HLRA",
                alias: "Cold Wave - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "CWAV_HLRR",
                alias: "Cold Wave - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "CWAV_EALB",
                alias: "Cold Wave - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "CWAV_EALP",
                alias: "Cold Wave - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "CWAV_EALPE",
                alias: "Cold Wave - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "CWAV_EALA",
                alias: "Cold Wave - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "CWAV_EALT",
                alias: "Cold Wave - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "CWAV_EALS",
                alias: "Cold Wave - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "CWAV_EALR",
                alias: "Cold Wave - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "CWAV_ALRB",
                alias: "Cold Wave - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "CWAV_ALRP",
                alias: "Cold Wave - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "CWAV_ALRA",
                alias: "Cold Wave - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "CWAV_ALR_NPCTL",
                alias: "Cold Wave - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "CWAV_RISKV",
                alias: "Cold Wave - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "CWAV_RISKS",
                alias: "Cold Wave - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "CWAV_RISKR",
                alias: "Cold Wave - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "DRGT",
        alias: "Drought",
        cols: [
            {
                name: "DRGT_EVNTS",
                alias: "Drought - Number of Events",
                type: "double",
            },
            {
                name: "DRGT_AFREQ",
                alias: "Drought - Annualized Frequency",
                type: "double",
            },
            {
                name: "DRGT_EXP_AREA",
                alias: "Drought - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "DRGT_EXPA",
                alias: "Drought - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "DRGT_EXPT",
                alias: "Drought - Exposure - Total",
                type: "double",
            },
            {
                name: "DRGT_HLRA",
                alias: "Drought - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "DRGT_HLRR",
                alias: "Drought - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "DRGT_EALA",
                alias: "Drought - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "DRGT_EALT",
                alias: "Drought - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "DRGT_EALS",
                alias: "Drought - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "DRGT_EALR",
                alias: "Drought - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "DRGT_ALRA",
                alias: "Drought - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "DRGT_ALR_NPCTL",
                alias: "Drought - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "DRGT_RISKV",
                alias: "Drought - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "DRGT_RISKS",
                alias: "Drought - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "DRGT_RISKR",
                alias: "Drought - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "ERQK",
        alias: "Earthquake",
        cols: [
            {
                name: "ERQK_EVNTS",
                alias: "Earthquake - Number of Events",
                type: "double",
            },
            {
                name: "ERQK_AFREQ",
                alias: "Earthquake - Annualized Frequency",
                type: "double",
            },
            {
                name: "ERQK_EXP_AREA",
                alias: "Earthquake - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "ERQK_EXPB",
                alias: "Earthquake - Exposure - Building Value",
                type: "double",
            },
            {
                name: "ERQK_EXPP",
                alias: "Earthquake - Exposure - Population",
                type: "double",
            },
            {
                name: "ERQK_EXPPE",
                alias: "Earthquake - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "ERQK_EXPT",
                alias: "Earthquake - Exposure - Total",
                type: "double",
            },
            {
                name: "ERQK_HLRB",
                alias: "Earthquake - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "ERQK_HLRP",
                alias: "Earthquake - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "ERQK_HLRR",
                alias: "Earthquake - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "ERQK_EALB",
                alias: "Earthquake - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "ERQK_EALP",
                alias: "Earthquake - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "ERQK_EALPE",
                alias: "Earthquake - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "ERQK_EALT",
                alias: "Earthquake - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "ERQK_EALS",
                alias: "Earthquake - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "ERQK_EALR",
                alias: "Earthquake - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "ERQK_ALRB",
                alias: "Earthquake - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "ERQK_ALRP",
                alias: "Earthquake - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "ERQK_ALR_NPCTL",
                alias: "Earthquake - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "ERQK_RISKV",
                alias: "Earthquake - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "ERQK_RISKS",
                alias: "Earthquake - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "ERQK_RISKR",
                alias: "Earthquake - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "HAIL",
        alias: "Hail",
        cols: [
            {
                name: "HAIL_EVNTS",
                alias: "Hail - Number of Events",
                type: "double",
            },
            {
                name: "HAIL_AFREQ",
                alias: "Hail - Annualized Frequency",
                type: "double",
            },
            {
                name: "HAIL_EXP_AREA",
                alias: "Hail - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "HAIL_EXPB",
                alias: "Hail - Exposure - Building Value",
                type: "double",
            },
            {
                name: "HAIL_EXPP",
                alias: "Hail - Exposure - Population",
                type: "double",
            },
            {
                name: "HAIL_EXPPE",
                alias: "Hail - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "HAIL_EXPA",
                alias: "Hail - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "HAIL_EXPT",
                alias: "Hail - Exposure - Total",
                type: "double",
            },
            {
                name: "HAIL_HLRB",
                alias: "Hail - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "HAIL_HLRP",
                alias: "Hail - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "HAIL_HLRA",
                alias: "Hail - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "HAIL_HLRR",
                alias: "Hail - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "HAIL_EALB",
                alias: "Hail - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "HAIL_EALP",
                alias: "Hail - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "HAIL_EALPE",
                alias: "Hail - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "HAIL_EALA",
                alias: "Hail - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "HAIL_EALT",
                alias: "Hail - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "HAIL_EALS",
                alias: "Hail - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "HAIL_EALR",
                alias: "Hail - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "HAIL_ALRB",
                alias: "Hail - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "HAIL_ALRP",
                alias: "Hail - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "HAIL_ALRA",
                alias: "Hail - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "HAIL_ALR_NPCTL",
                alias: "Hail - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "HAIL_RISKV",
                alias: "Hail - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "HAIL_RISKS",
                alias: "Hail - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "HAIL_RISKR",
                alias: "Hail - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "HWAV",
        alias: "Heat Wave",
        cols: [
            {
                name: "HWAV_EVNTS",
                alias: "Heat Wave - Number of Events",
                type: "double",
            },
            {
                name: "HWAV_AFREQ",
                alias: "Heat Wave - Annualized Frequency",
                type: "double",
            },
            {
                name: "HWAV_EXP_AREA",
                alias: "Heat Wave - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "HWAV_EXPB",
                alias: "Heat Wave - Exposure - Building Value",
                type: "double",
            },
            {
                name: "HWAV_EXPP",
                alias: "Heat Wave - Exposure - Population",
                type: "double",
            },
            {
                name: "HWAV_EXPPE",
                alias: "Heat Wave - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "HWAV_EXPA",
                alias: "Heat Wave - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "HWAV_EXPT",
                alias: "Heat Wave - Exposure - Total",
                type: "double",
            },
            {
                name: "HWAV_HLRB",
                alias: "Heat Wave - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "HWAV_HLRP",
                alias: "Heat Wave - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "HWAV_HLRA",
                alias: "Heat Wave - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "HWAV_HLRR",
                alias: "Heat Wave - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "HWAV_EALB",
                alias: "Heat Wave - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "HWAV_EALP",
                alias: "Heat Wave - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "HWAV_EALPE",
                alias: "Heat Wave - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "HWAV_EALA",
                alias: "Heat Wave - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "HWAV_EALT",
                alias: "Heat Wave - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "HWAV_EALS",
                alias: "Heat Wave - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "HWAV_EALR",
                alias: "Heat Wave - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "HWAV_ALRB",
                alias: "Heat Wave - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "HWAV_ALRP",
                alias: "Heat Wave - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "HWAV_ALRA",
                alias: "Heat Wave - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "HWAV_ALR_NPCTL",
                alias: "Heat Wave - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "HWAV_RISKV",
                alias: "Heat Wave - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "HWAV_RISKS",
                alias: "Heat Wave - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "HWAV_RISKR",
                alias: "Heat Wave - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "HRCN",
        alias: "Hurricane",
        cols: [
            {
                name: "HRCN_EVNTS",
                alias: "Hurricane - Number of Events",
                type: "double",
            },
            {
                name: "HRCN_AFREQ",
                alias: "Hurricane - Annualized Frequency",
                type: "double",
            },
            {
                name: "HRCN_EXP_AREA",
                alias: "Hurricane - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "HRCN_EXPB",
                alias: "Hurricane - Exposure - Building Value",
                type: "double",
            },
            {
                name: "HRCN_EXPP",
                alias: "Hurricane - Exposure - Population",
                type: "double",
            },
            {
                name: "HRCN_EXPPE",
                alias: "Hurricane - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "HRCN_EXPA",
                alias: "Hurricane - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "HRCN_EXPT",
                alias: "Hurricane - Exposure - Total",
                type: "double",
            },
            {
                name: "HRCN_HLRB",
                alias: "Hurricane - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "HRCN_HLRP",
                alias: "Hurricane - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "HRCN_HLRA",
                alias: "Hurricane - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "HRCN_HLRR",
                alias: "Hurricane - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "HRCN_EALB",
                alias: "Hurricane - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "HRCN_EALP",
                alias: "Hurricane - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "HRCN_EALPE",
                alias: "Hurricane - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "HRCN_EALA",
                alias: "Hurricane - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "HRCN_EALT",
                alias: "Hurricane - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "HRCN_EALS",
                alias: "Hurricane - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "HRCN_EALR",
                alias: "Hurricane - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "HRCN_ALRB",
                alias: "Hurricane - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "HRCN_ALRP",
                alias: "Hurricane - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "HRCN_ALRA",
                alias: "Hurricane - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "HRCN_ALR_NPCTL",
                alias: "Hurricane - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "HRCN_RISKV",
                alias: "Hurricane - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "HRCN_RISKS",
                alias: "Hurricane - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "HRCN_RISKR",
                alias: "Hurricane - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "ISTM",
        alias: "Ice Storm",
        cols: [
            {
                name: "ISTM_EVNTS",
                alias: "Ice Storm - Number of Events",
                type: "double",
            },
            {
                name: "ISTM_AFREQ",
                alias: "Ice Storm - Annualized Frequency",
                type: "double",
            },
            {
                name: "ISTM_EXP_AREA",
                alias: "Ice Storm - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "ISTM_EXPB",
                alias: "Ice Storm - Exposure - Building Value",
                type: "double",
            },
            {
                name: "ISTM_EXPP",
                alias: "Ice Storm - Exposure - Population",
                type: "double",
            },
            {
                name: "ISTM_EXPPE",
                alias: "Ice Storm - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "ISTM_EXPT",
                alias: "Ice Storm - Exposure - Total",
                type: "double",
            },
            {
                name: "ISTM_HLRB",
                alias: "Ice Storm - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "ISTM_HLRP",
                alias: "Ice Storm - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "ISTM_HLRR",
                alias: "Ice Storm - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "ISTM_EALB",
                alias: "Ice Storm - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "ISTM_EALP",
                alias: "Ice Storm - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "ISTM_EALPE",
                alias: "Ice Storm - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "ISTM_EALT",
                alias: "Ice Storm - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "ISTM_EALS",
                alias: "Ice Storm - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "ISTM_EALR",
                alias: "Ice Storm - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "ISTM_ALRB",
                alias: "Ice Storm - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "ISTM_ALRP",
                alias: "Ice Storm - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "ISTM_ALR_NPCTL",
                alias: "Ice Storm - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "ISTM_RISKV",
                alias: "Ice Storm - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "ISTM_RISKS",
                alias: "Ice Storm - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "ISTM_RISKR",
                alias: "Ice Storm - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "LNDS",
        alias: "Landslide",
        cols: [
            {
                name: "LNDS_EVNTS",
                alias: "Landslide - Number of Events",
                type: "double",
            },
            {
                name: "LNDS_AFREQ",
                alias: "Landslide - Annualized Frequency",
                type: "double",
            },
            {
                name: "LNDS_EXP_AREA",
                alias: "Landslide - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "LNDS_EXPB",
                alias: "Landslide - Exposure - Building Value",
                type: "double",
            },
            {
                name: "LNDS_EXPP",
                alias: "Landslide - Exposure - Population",
                type: "double",
            },
            {
                name: "LNDS_EXPPE",
                alias: "Landslide - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "LNDS_EXPT",
                alias: "Landslide - Exposure - Total",
                type: "double",
            },
            {
                name: "LNDS_HLRB",
                alias: "Landslide - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "LNDS_HLRP",
                alias: "Landslide - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "LNDS_HLRR",
                alias: "Landslide - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "LNDS_EALB",
                alias: "Landslide - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "LNDS_EALP",
                alias: "Landslide - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "LNDS_EALPE",
                alias: "Landslide - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "LNDS_EALT",
                alias: "Landslide - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "LNDS_EALS",
                alias: "Landslide - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "LNDS_EALR",
                alias: "Landslide - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "LNDS_ALRB",
                alias: "Landslide - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "LNDS_ALRP",
                alias: "Landslide - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "LNDS_ALR_NPCTL",
                alias: "Landslide - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "LNDS_RISKV",
                alias: "Landslide - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "LNDS_RISKS",
                alias: "Landslide - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "LNDS_RISKR",
                alias: "Landslide - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "LTNG",
        alias: "Lightning",
        cols: [
            {
                name: "LTNG_EVNTS",
                alias: "Lightning - Number of Events",
                type: "double",
            },
            {
                name: "LTNG_AFREQ",
                alias: "Lightning - Annualized Frequency",
                type: "double",
            },
            {
                name: "LTNG_EXP_AREA",
                alias: "Lightning - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "LTNG_EXPB",
                alias: "Lightning - Exposure - Building Value",
                type: "double",
            },
            {
                name: "LTNG_EXPP",
                alias: "Lightning - Exposure - Population",
                type: "double",
            },
            {
                name: "LTNG_EXPPE",
                alias: "Lightning - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "LTNG_EXPT",
                alias: "Lightning - Exposure - Total",
                type: "double",
            },
            {
                name: "LTNG_HLRB",
                alias: "Lightning - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "LTNG_HLRP",
                alias: "Lightning - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "LTNG_HLRR",
                alias: "Lightning - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "LTNG_EALB",
                alias: "Lightning - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "LTNG_EALP",
                alias: "Lightning - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "LTNG_EALPE",
                alias: "Lightning - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "LTNG_EALT",
                alias: "Lightning - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "LTNG_EALS",
                alias: "Lightning - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "LTNG_EALR",
                alias: "Lightning - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "LTNG_ALRB",
                alias: "Lightning - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "LTNG_ALRP",
                alias: "Lightning - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "LTNG_ALR_NPCTL",
                alias: "Lightning - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "LTNG_RISKV",
                alias: "Lightning - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "LTNG_RISKS",
                alias: "Lightning - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "LTNG_RISKR",
                alias: "Lightning - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "RFLD",
        alias: "Riverine Flooding",
        cols: [
            {
                name: "RFLD_EVNTS",
                alias: "Riverine Flooding - Number of Events",
                type: "double",
            },
            {
                name: "RFLD_AFREQ",
                alias: "Riverine Flooding - Annualized Frequency",
                type: "double",
            },
            {
                name: "RFLD_EXP_AREA",
                alias: "Riverine Flooding - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "RFLD_EXPB",
                alias: "Riverine Flooding - Exposure - Building Value",
                type: "double",
            },
            {
                name: "RFLD_EXPP",
                alias: "Riverine Flooding - Exposure - Population",
                type: "double",
            },
            {
                name: "RFLD_EXPPE",
                alias: "Riverine Flooding - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "RFLD_EXPA",
                alias: "Riverine Flooding - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "RFLD_EXPT",
                alias: "Riverine Flooding - Exposure - Total",
                type: "double",
            },
            {
                name: "RFLD_HLRB",
                alias: "Riverine Flooding - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "RFLD_HLRP",
                alias: "Riverine Flooding - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "RFLD_HLRA",
                alias: "Riverine Flooding - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "RFLD_HLRR",
                alias: "Riverine Flooding - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "RFLD_EALB",
                alias: "Riverine Flooding - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "RFLD_EALP",
                alias: "Riverine Flooding - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "RFLD_EALPE",
                alias: "Riverine Flooding - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "RFLD_EALA",
                alias: "Riverine Flooding - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "RFLD_EALT",
                alias: "Riverine Flooding - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "RFLD_EALS",
                alias: "Riverine Flooding - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "RFLD_EALR",
                alias: "Riverine Flooding - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "RFLD_ALRB",
                alias: "Riverine Flooding - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "RFLD_ALRP",
                alias: "Riverine Flooding - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "RFLD_ALRA",
                alias: "Riverine Flooding - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "RFLD_ALR_NPCTL",
                alias: "Riverine Flooding - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "RFLD_RISKV",
                alias: "Riverine Flooding - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "RFLD_RISKS",
                alias: "Riverine Flooding - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "RFLD_RISKR",
                alias: "Riverine Flooding - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "SWND",
        alias: "Strong Wind",
        cols: [
            {
                name: "SWND_EVNTS",
                alias: "Strong Wind - Number of Events",
                type: "double",
            },
            {
                name: "SWND_AFREQ",
                alias: "Strong Wind - Annualized Frequency",
                type: "double",
            },
            {
                name: "SWND_EXP_AREA",
                alias: "Strong Wind - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "SWND_EXPB",
                alias: "Strong Wind - Exposure - Building Value",
                type: "double",
            },
            {
                name: "SWND_EXPP",
                alias: "Strong Wind - Exposure - Population",
                type: "double",
            },
            {
                name: "SWND_EXPPE",
                alias: "Strong Wind - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "SWND_EXPA",
                alias: "Strong Wind - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "SWND_EXPT",
                alias: "Strong Wind - Exposure - Total",
                type: "double",
            },
            {
                name: "SWND_HLRB",
                alias: "Strong Wind - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "SWND_HLRP",
                alias: "Strong Wind - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "SWND_HLRA",
                alias: "Strong Wind - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "SWND_HLRR",
                alias: "Strong Wind - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "SWND_EALB",
                alias: "Strong Wind - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "SWND_EALP",
                alias: "Strong Wind - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "SWND_EALPE",
                alias: "Strong Wind - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "SWND_EALA",
                alias: "Strong Wind - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "SWND_EALT",
                alias: "Strong Wind - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "SWND_EALS",
                alias: "Strong Wind - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "SWND_EALR",
                alias: "Strong Wind - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "SWND_ALRB",
                alias: "Strong Wind - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "SWND_ALRP",
                alias: "Strong Wind - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "SWND_ALRA",
                alias: "Strong Wind - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "SWND_ALR_NPCTL",
                alias: "Strong Wind - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "SWND_RISKV",
                alias: "Strong Wind - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "SWND_RISKS",
                alias: "Strong Wind - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "SWND_RISKR",
                alias: "Strong Wind - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "TRND",
        alias: "Tornado",
        cols: [
            {
                name: "TRND_EVNTS",
                alias: "Tornado - Number of Events",
                type: "double",
            },
            {
                name: "TRND_AFREQ",
                alias: "Tornado - Annualized Frequency",
                type: "double",
            },
            {
                name: "TRND_EXP_AREA",
                alias: "Tornado - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "TRND_EXPB",
                alias: "Tornado - Exposure - Building Value",
                type: "double",
            },
            {
                name: "TRND_EXPP",
                alias: "Tornado - Exposure - Population",
                type: "double",
            },
            {
                name: "TRND_EXPPE",
                alias: "Tornado - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "TRND_EXPA",
                alias: "Tornado - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "TRND_EXPT",
                alias: "Tornado - Exposure - Total",
                type: "double",
            },
            {
                name: "TRND_HLRB",
                alias: "Tornado - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "TRND_HLRP",
                alias: "Tornado - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "TRND_HLRA",
                alias: "Tornado - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "TRND_HLRR",
                alias: "Tornado - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "TRND_EALB",
                alias: "Tornado - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "TRND_EALP",
                alias: "Tornado - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "TRND_EALPE",
                alias: "Tornado - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "TRND_EALA",
                alias: "Tornado - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "TRND_EALT",
                alias: "Tornado - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "TRND_EALS",
                alias: "Tornado - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "TRND_EALR",
                alias: "Tornado - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "TRND_ALRB",
                alias: "Tornado - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "TRND_ALRP",
                alias: "Tornado - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "TRND_ALRA",
                alias: "Tornado - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "TRND_ALR_NPCTL",
                alias: "Tornado - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "TRND_RISKV",
                alias: "Tornado - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "TRND_RISKS",
                alias: "Tornado - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "TRND_RISKR",
                alias: "Tornado - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "TSUN",
        alias: "Tsunami",
        cols: [
            {
                name: "TSUN_EVNTS",
                alias: "Tsunami - Number of Events",
                type: "double",
            },
            {
                name: "TSUN_AFREQ",
                alias: "Tsunami - Annualized Frequency",
                type: "double",
            },
            {
                name: "TSUN_EXP_AREA",
                alias: "Tsunami - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "TSUN_EXPB",
                alias: "Tsunami - Exposure - Building Value",
                type: "double",
            },
            {
                name: "TSUN_EXPP",
                alias: "Tsunami - Exposure - Population",
                type: "double",
            },
            {
                name: "TSUN_EXPPE",
                alias: "Tsunami - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "TSUN_EXPT",
                alias: "Tsunami - Exposure - Total",
                type: "double",
            },
            {
                name: "TSUN_HLRB",
                alias: "Tsunami - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "TSUN_HLRP",
                alias: "Tsunami - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "TSUN_HLRR",
                alias: "Tsunami - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "TSUN_EALB",
                alias: "Tsunami - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "TSUN_EALP",
                alias: "Tsunami - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "TSUN_EALPE",
                alias: "Tsunami - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "TSUN_EALT",
                alias: "Tsunami - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "TSUN_EALS",
                alias: "Tsunami - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "TSUN_EALR",
                alias: "Tsunami - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "TSUN_ALRB",
                alias: "Tsunami - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "TSUN_ALRP",
                alias: "Tsunami - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "TSUN_ALR_NPCTL",
                alias: "Tsunami - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "TSUN_RISKV",
                alias: "Tsunami - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "TSUN_RISKS",
                alias: "Tsunami - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "TSUN_RISKR",
                alias: "Tsunami - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "VLCN",
        alias: "Volcanic Activity",
        cols: [
            {
                name: "VLCN_EVNTS",
                alias: "Volcanic Activity - Number of Events",
                type: "double",
            },
            {
                name: "VLCN_AFREQ",
                alias: "Volcanic Activity - Annualized Frequency",
                type: "double",
            },
            {
                name: "VLCN_EXP_AREA",
                alias: "Volcanic Activity - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "VLCN_EXPB",
                alias: "Volcanic Activity - Exposure - Building Value",
                type: "double",
            },
            {
                name: "VLCN_EXPP",
                alias: "Volcanic Activity - Exposure - Population",
                type: "double",
            },
            {
                name: "VLCN_EXPPE",
                alias: "Volcanic Activity - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "VLCN_EXPT",
                alias: "Volcanic Activity - Exposure - Total",
                type: "double",
            },
            {
                name: "VLCN_HLRB",
                alias: "Volcanic Activity - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "VLCN_HLRP",
                alias: "Volcanic Activity - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "VLCN_HLRR",
                alias: "Volcanic Activity - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "VLCN_EALB",
                alias: "Volcanic Activity - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "VLCN_EALP",
                alias: "Volcanic Activity - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "VLCN_EALPE",
                alias: "Volcanic Activity - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "VLCN_EALT",
                alias: "Volcanic Activity - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "VLCN_EALS",
                alias: "Volcanic Activity - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "VLCN_EALR",
                alias: "Volcanic Activity - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "VLCN_ALRB",
                alias: "Volcanic Activity - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "VLCN_ALRP",
                alias: "Volcanic Activity - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "VLCN_ALR_NPCTL",
                alias: "Volcanic Activity - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "VLCN_RISKV",
                alias: "Volcanic Activity - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "VLCN_RISKS",
                alias: "Volcanic Activity - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "VLCN_RISKR",
                alias: "Volcanic Activity - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "WFIR",
        alias: "Wildfire",
        cols: [
            {
                name: "WFIR_EVNTS",
                alias: "Wildfire - Number of Events",
                type: "double",
            },
            {
                name: "WFIR_AFREQ",
                alias: "Wildfire - Annualized Frequency",
                type: "double",
            },
            {
                name: "WFIR_EXP_AREA",
                alias: "Wildfire - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "WFIR_EXPB",
                alias: "Wildfire - Exposure - Building Value",
                type: "double",
            },
            {
                name: "WFIR_EXPP",
                alias: "Wildfire - Exposure - Population",
                type: "double",
            },
            {
                name: "WFIR_EXPPE",
                alias: "Wildfire - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "WFIR_EXPA",
                alias: "Wildfire - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "WFIR_EXPT",
                alias: "Wildfire - Exposure - Total",
                type: "double",
            },
            {
                name: "WFIR_HLRB",
                alias: "Wildfire - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "WFIR_HLRP",
                alias: "Wildfire - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "WFIR_HLRA",
                alias: "Wildfire - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "WFIR_HLRR",
                alias: "Wildfire - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "WFIR_EALB",
                alias: "Wildfire - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "WFIR_EALP",
                alias: "Wildfire - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "WFIR_EALPE",
                alias: "Wildfire - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "WFIR_EALA",
                alias: "Wildfire - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "WFIR_EALT",
                alias: "Wildfire - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "WFIR_EALS",
                alias: "Wildfire - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "WFIR_EALR",
                alias: "Wildfire - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "WFIR_ALRB",
                alias: "Wildfire - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "WFIR_ALRP",
                alias: "Wildfire - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "WFIR_ALRA",
                alias: "Wildfire - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "WFIR_ALR_NPCTL",
                alias: "Wildfire - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "WFIR_RISKV",
                alias: "Wildfire - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "WFIR_RISKS",
                alias: "Wildfire - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "WFIR_RISKR",
                alias: "Wildfire - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
    {
        name: "WNTW",
        alias: "Winter Weather",
        cols: [
            {
                name: "WNTW_EVNTS",
                alias: "Winter Weather - Number of Events",
                type: "double",
            },
            {
                name: "WNTW_AFREQ",
                alias: "Winter Weather - Annualized Frequency",
                type: "double",
            },
            {
                name: "WNTW_EXP_AREA",
                alias: "Winter Weather - Exposure - Impacted Area (sq mi)",
                type: "double",
            },
            {
                name: "WNTW_EXPB",
                alias: "Winter Weather - Exposure - Building Value",
                type: "double",
            },
            {
                name: "WNTW_EXPP",
                alias: "Winter Weather - Exposure - Population",
                type: "double",
            },
            {
                name: "WNTW_EXPPE",
                alias: "Winter Weather - Exposure - Population Equivalence",
                type: "double",
            },
            {
                name: "WNTW_EXPA",
                alias: "Winter Weather - Exposure - Agriculture Value",
                type: "double",
            },
            {
                name: "WNTW_EXPT",
                alias: "Winter Weather - Exposure - Total",
                type: "double",
            },
            {
                name: "WNTW_HLRB",
                alias: "Winter Weather - Historic Loss Ratio - Buildings",
                type: "double",
            },
            {
                name: "WNTW_HLRP",
                alias: "Winter Weather - Historic Loss Ratio - Population",
                type: "double",
            },
            {
                name: "WNTW_HLRA",
                alias: "Winter Weather - Historic Loss Ratio - Agriculture",
                type: "double",
            },
            {
                name: "WNTW_HLRR",
                alias: "Winter Weather - Historic Loss Ratio - Total Rating",
                type: "string",
            },
            {
                name: "WNTW_EALB",
                alias: "Winter Weather - Expected Annual Loss - Building Value",
                type: "double",
            },
            {
                name: "WNTW_EALP",
                alias: "Winter Weather - Expected Annual Loss - Population",
                type: "double",
            },
            {
                name: "WNTW_EALPE",
                alias: "Winter Weather - Expected Annual Loss - Population Equivalence",
                type: "double",
            },
            {
                name: "WNTW_EALA",
                alias: "Winter Weather - Expected Annual Loss - Agriculture Value",
                type: "double",
            },
            {
                name: "WNTW_EALT",
                alias: "Winter Weather - Expected Annual Loss - Total",
                type: "double",
            },
            {
                name: "WNTW_EALS",
                alias: "Winter Weather - Expected Annual Loss Score",
                type: "double",
            },
            {
                name: "WNTW_EALR",
                alias: "Winter Weather - Expected Annual Loss Rating",
                type: "string",
            },
            {
                name: "WNTW_ALRB",
                alias: "Winter Weather - Expected Annual Loss Rate - Building",
                type: "double",
            },
            {
                name: "WNTW_ALRP",
                alias: "Winter Weather - Expected Annual Loss Rate - Population",
                type: "double",
            },
            {
                name: "WNTW_ALRA",
                alias: "Winter Weather - Expected Annual Loss Rate - Agriculture",
                type: "double",
            },
            {
                name: "WNTW_ALR_NPCTL",
                alias: "Winter Weather - Expected Annual Loss Rate - National Percentile",
                type: "double",
            },
            {
                name: "WNTW_RISKV",
                alias: "Winter Weather - Hazard Type Risk Index Value",
                type: "double",
            },
            {
                name: "WNTW_RISKS",
                alias: "Winter Weather - Hazard Type Risk Index Score",
                type: "double",
            },
            {
                name: "WNTW_RISKR",
                alias: "Winter Weather - Hazard Type Risk Index Rating",
                type: "string",
            },
        ],
    },
];
/*
bbbMap.nirCategories.map((c) => { 
    let cols = temp1.filter((t) => t.name.includes(`${c.name}_`));
    let m = cols.map((t) => {
        return { name: t.name, alias: t.alias, type: t.type };
    }); // {name: t.name, alias: t.alias, type: t.type});
    c["cols"] = m;
    return c;
});s
*/
