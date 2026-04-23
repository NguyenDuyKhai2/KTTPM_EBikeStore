import java.io.File;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

public class PdfPeek {
    public static void main(String[] args) throws Exception {
        try (PDDocument doc = PDDocument.load(new File(args[0]))) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setStartPage(1);
            stripper.setEndPage(Math.min(2, doc.getNumberOfPages()));
            String text = stripper.getText(doc);
            System.out.println(text.substring(0, Math.min(2500, text.length())));
        }
    }
}
