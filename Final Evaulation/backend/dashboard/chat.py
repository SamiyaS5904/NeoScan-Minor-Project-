def generate_chat_response(
    user_message,
    history=None,
    api_key=None
):

    msg = user_message.lower()

    if (
        "scan" in msg
        or "skin" in msg
    ):
        return (
            "Upload a clear baby skin image "
            "under proper lighting conditions "
            "for better jaundice prediction."
        )

    elif (
        "jaundice" in msg
    ):
        return (
            "Neonatal jaundice is caused by "
            "increased bilirubin levels in "
            "newborns. NeoScan helps detect "
            "risk non-invasively."
        )

    elif (
        "bilirubin" in msg
        or "high" in msg
    ):
        return (
            "High bilirubin may indicate "
            "moderate or high jaundice risk. "
            "Clinical monitoring is advised."
        )

    elif (
        "doctor" in msg
        or "consult" in msg
    ):
        return (
            "Consult a pediatrician if "
            "yellow skin increases, feeding "
            "reduces, or baby feels weak."
        )

    elif (
        "baby" in msg
        or "care" in msg
    ):
        return (
            "Ensure proper feeding, "
            "hydration and regular monitoring "
            "of newborn health."
        )

    return (
        "I can help with jaundice, "
        "bilirubin monitoring, baby care "
        "and skin scanning."
    )