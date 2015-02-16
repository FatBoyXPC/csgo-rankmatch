$(function() {
    var ranksToNumbers = {
        S1: 1,
        S2: 2,
        S3: 3,
        S4: 4,
        SE: 5,
        SEM: 6,
        GN1: 7,
        GN2: 8,
        GN3: 9,
        GN4: 10,
        MG1: 11,
        MG2: 12,
        MGE: 13,
        DMG: 14,
        LE: 15,
        LEM: 16,
        SMFC: 17,
        GE: 18,
    };

    var numbersToRanks = {
        1: "S1",
        2: "S2",
        3: "S3",
        4: "S4",
        5: "SE",
        6: "SEM",
        7: "GN1",
        8: "GN2",
        9: "GN3",
        10: "GN4",
        11: "MG1",
        12: "MG2",
        13: "MGE",
        14: "DMG",
        15: "LE",
        16: "LEM",
        17: "SMFC",
        18: "GE",
    };

    var finishedSet;
    var resultsTemplate = $('.result-template');

    $('.glyphicon').click(function() {
        var input = $(this).parent('.form-group').children('input');
        var inputVal = input.val();

        if ('' === inputVal) {
            inputVal = 0;
        }

        console.log(inputVal);
        if ($(this).hasClass('glyphicon-chevron-up')) {
            input.val(inputVal++);
        } else if ($(this).hasClass('glyphicon-chevron-down')) {
            input.val(inputVal--);
        }
    })

    $('form').submit(function(e) {
        e.preventDefault();
        $('.results').html('');

        var error;
        var errorObj = $('.alert-danger');
        finishedSet = [];
        var inputs = $('form :text');
        var notInt;
        var set = [];

        $.each(inputs, function(key, value) {
            var qty = $(value).val();

            if ("" === qty) {
                qty = 0;
            }

            if (qty == parseInt(qty)) {
                var rank = $(value).attr('name');

                for (var i = 0; i < qty; i++) {
                    set.push(rank);
                }
            } else {
                notInt = true;
            }
        });


        if (set.length < 2 || set.length > 10) {
            error = 'You must have at least 2 and 10 or fewer ranks entered';
        }

        if (notInt) {
            error = "You must enter only integers into the fields";
        }

        if (error) {
            errorObj.removeClass('sr-only').text(error);
            return;
        } else {
            errorObj.addClass('sr-only');
        }

        var rangeMax = Math.pow(2, (set.length -1));

        // Convert string values into numerical values
        set.forEach(function(value, index) {
            set[index] = ranksToNumbers[value];
        });

        /**
         * Treating the set array as a binary set - 1 bit per set item/element. The
         * exponend is set.length - 1 to permute only the first half of combinations.
         * this is so that we won't get the combinations going into Group A, then into
         * Group B. This is just a clever way to prevent duplicates.
         */
        for (var subsetIndex = 0; subsetIndex < rangeMax; subsetIndex++) {
            var avgA = null;
            var avgB = null;
            var newSetA = [];
            var newSetB = [];
            var setToAdd;
            var stringifyA;
            var stringifyB;
            var stringifyVal;
            var setToAddExists = false;
            var sum;

            // Checking which bits are set in the possible subset, putting matched
            // values into a new array (newSetA) if they match, or into another new
            // array (newSetB) if they don't. This gives us our 2 distinct sets.
            set.forEach(function(value, index) {
                if ((subsetIndex >> index) & 1) {
                    newSetA.push(set[index]);
                } else {
                    newSetB.push(set[index]);
                }
            });

            // Calculate array sum and average
            if (newSetA.length > 0 && newSetA.length <= 5) {
                sum = newSetA.reduce(function(prev, curr) {
                    return prev + curr;
                });

                avgA = sum / newSetA.length;
            }

            // Calculate array sum and average
            if (newSetB.length > 0 && newSetB.length <= 5) {
                sum = newSetB.reduce(function(prev, curr) {
                    return prev + curr;
                });

                avgB = sum / newSetB.length;
            }

            if (avgA && avgB) {
                newSetA.sort(function(a, b) {
                    return a - b;
                });

                newSetB.sort(function(a, b) {
                    return a - b;
                });

                // Convert both sets to back to string values
                newSetA.forEach(function(value, index) {
                    newSetA[index] = numbersToRanks[value];
                });

                newSetB.forEach(function(value, index) {
                    newSetB[index] = numbersToRanks[value];
                });

                setToAdd = {
                    delta: Math.round(Math.abs(avgA - avgB) * 100) / 100,
                    setA: newSetA,
                    setB: newSetB,
                };

                setToAddInv = {
                    delta: Math.round(Math.abs(avgA - avgB) * 100) / 100,
                    setA: newSetB,
                    setB: newSetA,
                }

                // Check for duplicates - stringify is a hacky way to check the arrays
                // but it works. This is easy because we sorted the sets
                // previously. A and B can mirror each other and possibly be
                // duplicates.
                finishedSet.forEach(function(value, index) {
                    stringifyVal = JSON.stringify(value);
                    stringifyA = JSON.stringify(setToAdd)
                    stringifyB = JSON.stringify({
                        delta: setToAdd.delta,
                        setA: setToAdd.setB,
                        setB: setToAdd.setA,
                    });
                    // stringifyB = stringifyA;

                    // Checking for duplicates
                    if (stringifyA == stringifyVal || stringifyB == stringifyVal) {
                        setToAddExists = true;
                    }
                });

                // If it's not a duplicate then add to set
                if (!setToAddExists) {
                    finishedSet.push(setToAdd);
                }
            }
        }

        // Sort by delta ascending
        finishedSet.sort(function(a, b) {
            return a.delta - b.delta;
        });

        if (finishedSet.length >= 5) {
            var rows = 5;
        } else {
            var rows = finishedSet.length;
        }

        var row;
        for (var j = 0; j < rows; j++) {
            row = finishedSet[j];
            var template = resultsTemplate.clone();
            
            $('.delta', template).text(row.delta);

            $.each(row.setA, function(key, value) {
                $('.team-a .images', template).append('<img src="images/' + value + '.png">');
            });

            $.each(row.setB, function(key, value) {
                $('.team-b .images', template).append('<img src="images/' + value + '.png">');
            });

            $('.results').append(template);
        }

        // console.log(finishedSet);
        // console.log(finishedSet.length); // 48
    });
});