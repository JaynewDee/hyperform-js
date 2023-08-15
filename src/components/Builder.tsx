import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react"
import { ResumeConfig } from "../App";
import { jsPDF } from 'jspdf';

type BuilderProps = ResumeBuilderProps;

export function Builder(props: BuilderProps) {
    const { fullName, subtitle } = props.config;

    const [formState, setFormState] = useState({
        fullName: "",
        subtitle: ""
    })

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;

        setFormState(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSaveConfig = () => {
        LocalStorageHandler.updateResumeConfig(formState);
        props.setConfig(formState);
    }

    const handleCreateDocument = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        writeFromConfig(props.config);
    }

    return <form className="builder-form" onSubmit={handleCreateDocument}>
        <label>Professional's Name</label>
        <input placeholder={fullName} value={formState.fullName} name="fullName" onChange={handleInputChange}></input>
        <label>Resum&eacute; Subtitle</label>
        <input placeholder={subtitle} value={formState.subtitle} name="subtitle" onChange={handleInputChange}></input>
        <button type="button" onClick={handleSaveConfig}>SAVE CONFIGURATION</button>
        <button type="submit">CREATE DOCUMENT</button>
    </form>
}

interface ResumeBuilderProps {
    config: ResumeConfig,
    setConfig: Dispatch<SetStateAction<ResumeConfig>>
}

// Location is [x, y] tuple of coordinates, measured in mm
function writeFromConfig(config: ResumeConfig) {
    const { fullName, subtitle } = config;

    const doc = new jsPDF();

    const nameOptions = { align: "center" } as const;
    const nameLocation = [105, 10] as const;

    const subtitleOptions = { align: "center" } as const;
    const subtitleLocation = [105, 17] as const;

    doc.text(fullName, ...nameLocation, nameOptions)
        .setFontSize(12)
        .text(subtitle, ...subtitleLocation, subtitleOptions)
        .save("test_out.pdf");
}

export class LocalStorageHandler {
    static resumeConfigKey: string = "resumeConfig";
    static defaultConfig: string = JSON.stringify("");

    static getResumeConfig() {
        const currentConfig = localStorage.getItem(LocalStorageHandler.resumeConfigKey) || LocalStorageHandler.defaultConfig;
        return JSON.parse(currentConfig);
    }

    static updateResumeConfig(newConfig: ResumeConfig) {
        const configKey = "resumeConfig";

        const old = localStorage.getItem(configKey) || LocalStorageHandler.defaultConfig;
        const oldParsed = JSON.parse(old);

        const updated = { ...oldParsed, ...newConfig };

        const toStore = JSON.stringify(updated);

        localStorage.setItem(configKey, toStore);
    }
}


export const ResumeBuilder = (props: ResumeBuilderProps) => Builder(props);